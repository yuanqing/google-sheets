const createApiClient = require('../create-api-client')
const Spreadsheet = require('./spreadsheet')

async function getSpreadsheet (serviceAccountCredentials, id) {
  const request = await createApiClient(serviceAccountCredentials)
  return new Spreadsheet(request, id)
}

module.exports = getSpreadsheet
