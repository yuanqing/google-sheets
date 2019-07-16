const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function createSheet (request, spreadsheetId, name, headers) {
  const id = await addSheet(request, spreadsheetId, name)
  const columnRange = await setHeaders(request, spreadsheetId, name, headers)
  return new Sheet(request, spreadsheetId, `${id}`, name, headers, columnRange)
}

async function addSheet (request, spreadsheetId, name) {
  // https://developers.google.com/sheets/api/samples/sheet#add_a_sheet
  const result = await request('POST', `${spreadsheetId}:batchUpdate`, {
    requests: [
      {
        addSheet: {
          properties: {
            title: name
          }
        }
      }
    ]
  })
  return result.replies[0].addSheet.properties.sheetId
}

async function setHeaders (request, spreadsheetId, name, headers) {
  // https://developers.google.com/sheets/api/samples/writing#write_a_single_range
  const range = `${name}!1:1`
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
