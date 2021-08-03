require('dotenv').config()
const path = require('path')
const geoip = require('./lib/geoip')

const geoAsnPath = path.join(process.env.DB_DIR, process.env.ASN_DB_NAME)
const geoCityPath = path.join(process.env.DB_DIR, process.env.CITY_DB_NAME)


function die(msg) {
  console.error(`Error: ${msg}`)
  process.exit(1)
}

async function showIpInfo(ips) {
  await geoip.openReaders(geoCityPath, geoAsnPath)
  for (ip of ips) {
    console.log('---')
    const city = geoip.getCity(ip)
    const asn = geoip.getASN(ip)
    console.log(`IP Address: ${ip}`)
    const asTable = {
      'Country': city.country.names.en,
      'ISO': city.country.isoCode,
      'Registered Ctry': city.registeredCountry.names.en,
      'AS': asn.autonomousSystemNumber,
      'Org': asn.autonomousSystemOrganization,
      'AS net': asn.network
    }
    if (city.traits && city.traits.network) {
      asTable['IP net'] = city.traits.network
    }
    console.table(asTable)
    //console.log(JSON.stringify({ ...city, ...asn }, null, 2))
  }
}

// TODO We could print USAGE if arguments are missing.
if (process.argv < 3) die('Missing IP address(es) as argument(s)')
const ipArgs = process.argv.splice(2)

showIpInfo(ipArgs)