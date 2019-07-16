const createApiClient = require('./create-api-client')
const Spreadsheet = require('./spreadsheet')

async function getSpreadsheet (serviceAccountCredentials, spreadsheetId) {
  const request = await createApiClient(serviceAccountCredentials)
  return new Spreadsheet(request, spreadsheetId)
}

module.exports = getSpreadsheet
