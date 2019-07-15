const createApiClient = require('./create-api-client')
const Sheet = require('./sheet')

class Sheets {
  async initialise (sheetsId, serviceAccountCredentials) {
    this.sheetsId = sheetsId
    this.request = await createApiClient(sheetsId, serviceAccountCredentials)
    return this
  }

  async createSheet (sheetName, headers) {
    return new Sheet().createSheet(sheetName, headers, this.request)
  }
}

module.exports = Sheets
