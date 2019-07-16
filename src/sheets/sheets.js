const getSheet = require('../sheet/get-sheet')
const createSheet = require('../sheet/create-sheet')

class Sheets {
  constructor (request, id) {
    this.request = request
    this.id = id
  }

  async createSheet (name, headers) {
    return createSheet(this.request, name, headers)
  }

  async getSheet (name) {
    return getSheet(this.request, name)
  }
}

module.exports = Sheets
