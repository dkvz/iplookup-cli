#!/usr/bin/env node

require('dotenv').config()
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const path = require('path')
const geoip = require('./lib/geoip')
const { reverseLookup } = require('./lib/dns')

const geoAsnPath = path.join(process.env.DB_DIR, process.env.ASN_DB_NAME)
const geoCityPath = path.join(process.env.DB_DIR, process.env.CITY_DB_NAME)


function die(msg) {
  console.error(`Error: ${msg}`)
  process.exit(1)
}

async function showIpInfo(ips, short = false, disableDnsLookups = false) {
  await geoip.openReaders(geoCityPath, geoAsnPath)
  for (ip of ips) {
    const city = geoip.getCity(ip)
    const asn = geoip.getASN(ip)
    let asTable = { 'IP Address': ip }
    if (city && city.country) {
      asTable = {
        ...asTable,
        'Country': city.country.names.en,
        'ISO': city.country.isoCode,
        'Registered Ctry': city.registeredCountry && city.registeredCountry.names.en,
      }
    } else {
      asTable['Country'] = 'No data'
    }
    if (asn) {
      asTable['AS'] = asn.autonomousSystemNumber
      asTable['Org'] = asn.autonomousSystemOrganization
      asTable['AS net'] = asn.network
    }
    // At some point I realized I needed this:
    if (city && city.traits && city.traits.network) {
      asTable['IP net'] = city.traits.network
    }
    if (short) {
      console.log(asTable.ISO ? asTable.ISO : '??')
    } else {
      //console.log(`IP Address: ${ip}`)
      if (!disableDnsLookups) {
        asTable['Reverse DNS'] = await reverseLookup(ip)
      }
      console.table(asTable)
      console.log('---')
    }
    //console.log(JSON.stringify({ ...city, ...asn }, null, 2))
  }
}


const argv = yargs(hideBin(process.argv))
  .usage('$0 [-s] IP_ADDRESS1 IP_ADDRESS2 ...')
  .option('short', {
    alias: 's',
    describe: 'Only show the country code',
    boolean: true,
    default: false
  })
  .option('nodns', {
    alias: 'n',
    describe: 'Disable DNS lookups',
    boolean: true,
    default: false
  })
  .help()
  .parse()

if (argv._.length < 1) die('Missing IP address(es) as argument(s)')

//const ipArgs = process.argv.splice(2)
showIpInfo(argv._, argv.short, argv.nodns)