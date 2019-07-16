const createApiClient = require('../create-api-client')
const Spreadsheet = require('./spreadsheet')

async function createSpreadsheet (serviceAccountCredentials) {
  const request = await createApiClient(serviceAccountCredentials)
  const result = await request('POST')
  const id = result.spreadsheetId
  return new Spreadsheet(request, id)
}

module.exports = createSpreadsheet
