const getSheet = require('../sheet/get-sheet')
const createSheet = require('../sheet/create-sheet')

class Spreadsheet {
  constructor (request, id) {
    this.request = request
    this.id = id
  }

  async createSheet (name, headers) {
    return createSheet(this.request, this.id, name, headers)
  }

  async getSheet (name) {
    return getSheet(this.request, this.id, name)
  }
}

module.exports = Spreadsheet
