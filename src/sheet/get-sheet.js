const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function getSheet (request, spreadsheetId, name) {
  const id = await getId(request, spreadsheetId, name)
  const { headers, columnRange } = await getHeadersAndColumnRange(
    request,
    spreadsheetId,
    name
  )
  return new Sheet(request, spreadsheetId, `${id}`, name, headers, columnRange)
}

async function getId (request, spreadsheetId, name) {
  // https://developers.google.com/sheets/api/samples/sheet#determine_sheet_id_and_other_properties
  const result = await request(
    'GET',
    `${spreadsheetId}?&fields=sheets.properties`
  )
  return result.sheets.reduce(function (result, item) {
    if (result !== null) {
      return result
    }
    if (item.properties.title === name) {
      return item.properties.sheetId
    }
    return null
  }, null)
}

async function getHeadersAndColumnRange (request, spreadsheetId, name) {
  // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
  const result = await request('GET', `${spreadsheetId}/values/${name}!1:1`)
  return {
    headers: result.values[0],
    columnRange: extractColumnRange(result.range)
  }
}

module.exports = getSheet
