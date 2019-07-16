const nanoid = require('nanoid')
const test = require('tape')

const googleSheets = require('..')

async function createGoogleSheets () {
  return googleSheets('116rzvqotNCvAUselqAELxM_tLdVl-fDtG_xg_pjeu0A', {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
  })
}

test('get rows', async function (t) {
  t.plan(1)
  const googleSheets = await createGoogleSheets()
  const sheet = await googleSheets.getSheet('Sheet1')
  const actual = await sheet.getRows(1, 3)
  const expected = [
    { id: '1', name: 'qux' },
    { id: '2', name: 'quux' },
    { id: '3', name: 'quuux' }
  ]
  t.deepEqual(actual, expected)
})

test('add rows', async function (t) {
  t.plan(1)
  let sheet
  try {
    const googleSheets = await createGoogleSheets()
    sheet = await googleSheets.createSheet(nanoid(), ['id', 'name'])
    await sheet.addRows([
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
      { id: '3', name: 'baz' }
    ])
    const actual = await sheet.getRows(1, 3)
    const expected = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
      { id: '3', name: 'baz' }
    ]
    t.deepEqual(actual, expected)
  } finally {
    await sheet.deleteSheet()
  }
})
