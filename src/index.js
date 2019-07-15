const Sheets = require('./sheets')

async function createGoogleSheets (spreadsheetId, serviceAccountCredentials) {
  if (spreadsheetId == null) {
    throw new Error('Need a spreadsheet ID')
  }
  if (serviceAccountCredentials == null) {
    throw new Error('Need service account credentials')
  }
  return new Sheets().initialise(spreadsheetId, serviceAccountCredentials)
}

module.exports = createGoogleSheets
