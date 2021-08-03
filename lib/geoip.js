const Reader = require('@maxmind/geoip2-node').Reader
const path = require('path')

const geoip = {
  cityReader: null,
  asnReader: null,
  openReaders: async function (geoCityPath, geoASNPath) {
    await this._openReader('cityReader', path.resolve(geoCityPath))
    await this._openReader('asnReader', path.resolve(geoASNPath))
  },
  _openReader: async function (readerName, filename) {
    try {
      if (!this[readerName]) {
        this[readerName] = await Reader.open(path.resolve(filename))
      }
    } catch (ex) {
      console.error(`Error reading GeoIP database ${filename}`, ex)
    }
  },
  getCity: function (ip) {
    try {
      if (!this.cityReader) {
        throw new Error('Reader is not initialized - Call openReaders first')
      }
      return this.cityReader.city(ip)
    } catch (ex) {
      console.error('Error reading GeoIP city info', ex)
    }
  },
  getASN: function (ip) {
    try {
      if (!this.asnReader) {
        throw new Error('Reader is not initialized - Call openReaders first')
      }
      return this.asnReader.asn(ip)
    } catch (ex) {
      if (ex && ex.name === 'AddressNotFoundError') {
        // The AS isn't in the database, return null.
        // This isn't an error and happens a lot.
        return null;
      }
      console.error('Error reading GeoIP ASN info', JSON.stringify(ex, null, 2))
    }
  }
}

module.exports = geoip