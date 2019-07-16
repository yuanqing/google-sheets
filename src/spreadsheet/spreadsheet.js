const getSheet = require('../sheet/get-sheet')
const createSheet = require('../sheet/create-sheet')

class Spreadsheet {
  constructor (request, spreadsheetId) {
    this.request = request
    this.spreadsheetId = spreadsheetId
  }

  async createSheet (name, headers) {
    return createSheet(this.request, this.spreadsheetId, name, headers)
  }

  async getSheet (name) {
    return getSheet(this.request, this.spreadsheetId, name)
  }
}

module.exports = Spreadsheet
