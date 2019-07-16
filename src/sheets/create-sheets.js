const createApiClient = require('../create-api-client')
const Sheets = require('./sheets')

async function createSheets (id, serviceAccountCredentials) {
  if (id == null) {
    throw new Error('Need a spreadsheet ID')
  }
  if (serviceAccountCredentials == null) {
    throw new Error('Need service account credentials')
  }
  const request = await createApiClient(id, serviceAccountCredentials)
  return new Sheets(request, id)
}

module.exports = createSheets
