const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function createSheet (request, spreadsheetId, sheetName, headers) {
  const sheetId = await addSheet(request, spreadsheetId, sheetName)
  const columnRange = await setHeaders(
    request,
    spreadsheetId,
    sheetName,
    headers
  )
  return new Sheet(
    request,
    spreadsheetId,
    `${sheetId}`,
    sheetName,
    headers,
    columnRange
  )
}

async function addSheet (request, spreadsheetId, sheetName) {
  // https://developers.google.com/sheets/api/samples/sheet#add_a_sheet
  const result = await request('POST', `${spreadsheetId}:batchUpdate`, {
    requests: [
      {
        addSheet: {
          properties: {
            title: sheetName
          }
        }
      }
    ]
  })
  return result.replies[0].addSheet.properties.sheetId
}

async function setHeaders (request, spreadsheetId, sheetName, headers) {
  // https://developers.google.com/sheets/api/samples/writing#write_a_single_range
  const range = `${sheetName}!1:1`
  const result = await request(
    'PUT',
    `${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      range,
      majorDimension: 'ROWS',
      values: [headers]
    }
  )
  return extractColumnRange(result.updatedRange)
}

module.exports = createSheet
