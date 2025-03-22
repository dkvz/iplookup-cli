const dns = require('dns')
const { URL } = require('url')

const nothingFoundMsg = 'No record'

function reverseLookup(ip) {
  return new Promise((resolve, reject) => {
    try {
      dns.reverse(ip, (err, hostnames) => {
        if (err) {
          if (err.message.includes('ENOTFOUND')) resolve(nothingFoundMsg)
          else reject(err)
        }
        if (hostnames && hostnames.length > 0) resolve(hostnames[0])
        else resolve('')
      })
    } catch(e) {
      reject(e)
    }
  })
}

function lookup(name) {
  return new Promise((resolve, reject) => {
    // Attempt to parse the URL first:
    let processedName
    try {
      //const parsed = URL.parse(name, false)
      const parsed = new URL(name)
      processedName = parsed.hostname
    } catch {
      processedName = name
    }
    dns.resolve(processedName, 'A', (err, records) => {
      if (err || records.length < 1) reject(err)
      resolve(records[0])
    })
  })
}

module.exports = { reverseLookup, lookup }