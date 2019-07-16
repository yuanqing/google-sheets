const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function getSheet (request, name) {
  const id = await getId(request, name)
  const { headers, columnRange } = await getHeadersAndColumnRange(request, name)
  return new Sheet(request, id, name, headers, columnRange)
}

async function getId (request, name) {
  // https://developers.google.com/sheets/api/samples/sheet#determine_sheet_id_and_other_properties
  const result = await request('GET', '?&fields=sheets.properties')
  return result.sheets.reduce(function (result, item) {
    if (result) {
      return result
    }
    if (item.properties.title === name) {
      return item.properties.sheetId
    }
    return null
  }, null)
}

async function getHeadersAndColumnRange (request, name) {
  // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
  const result = await request('GET', `/values/${name}!1:1`)
  return {
    headers: result.values[0],
    columnRange: extractColumnRange(result.range)
  }
}

module.exports = getSheet
