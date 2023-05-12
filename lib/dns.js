const dns = require('dns')

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

module.exports = { reverseLookup }