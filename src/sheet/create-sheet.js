const extractColumnRange = require('./extract-column-range')
const Sheet = require('./sheet')

async function createSheet (request, name, headers) {
  // https://developers.google.com/sheets/api/samples/sheet#add_a_sheet
  const addSheetResult = await request('POST', ':batchUpdate', {
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
  const id = addSheetResult.replies[0].addSheet.properties.sheetId
  // https://developers.google.com/sheets/api/samples/writing#write_a_single_range
  const range = `${name}!1:1`
  const addHeadersResult = await request(
    'PUT',
    `/values/${range}?valueInputOption=USER_ENTERED`,
    {
      range,
      majorDimension: 'ROWS',
      values: [headers]
    }
  )
  const columnRange = extractColumnRange(addHeadersResult.updatedRange)
  return new Sheet(request, id, name, headers, columnRange)
}

module.exports = createSheet
