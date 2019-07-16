const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function getSheet (request, spreadsheetId, sheetName) {
  const sheetId = await getId(request, spreadsheetId, sheetName)
  const { headers, columnRange } = await getHeadersAndColumnRange(
    request,
    spreadsheetId,
    sheetName
  )
  return new Sheet(request, spreadsheetId, `${sheetId}`, sheetName, headers, columnRange)
}

async function getId (request, spreadsheetId, sheetName) {
  // https://developers.google.com/sheets/api/samples/sheet#determine_sheet_id_and_other_properties
  const result = await request(
    'GET',
    `${spreadsheetId}?&fields=sheets.properties`
  )
  return result.sheets.reduce(function (result, item) {
    if (result !== null) {
      return result
    }
    if (item.properties.title === sheetName) {
      return item.properties.sheetId
    }
    return null
  }, null)
}

async function getHeadersAndColumnRange (request, spreadsheetId, sheetName) {
  // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
  const result = await request('GET', `${spreadsheetId}/values/${sheetName}!1:1`)
  return {
    headers: result.values[0],
    columnRange: extractColumnRange(result.range)
  }
}

module.exports = getSheet
