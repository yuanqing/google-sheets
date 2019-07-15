const nanoid = require('nanoid')
const test = require('tape')

const createGoogleSheets = require('..')

async function createTest (callback) {
  const googleSheets = await createGoogleSheets(
    '116rzvqotNCvAUselqAELxM_tLdVl-fDtG_xg_pjeu0A',
    {
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY
    }
  )
  const sheet = await googleSheets.createSheet(nanoid(), ['id', 'name'])
  await sheet.addRows([
    { id: '1', name: 'foo' },
    { id: '2', name: 'bar' },
    { id: '3', name: 'baz' }
  ])
  try {
    await callback(sheet)
  } finally {
    await sheet.deleteSheet()
  }
}

test('get rows', function (t) {
  createTest(async function (sheet) {
    t.plan(1)
    const actual = await sheet.getRows(1, 3)
    const expected = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
      { id: '3', name: 'baz' }
    ]
    t.deepEqual(actual, expected)
  })
})

test('add rows', function (t) {
  createTest(async function (sheet) {
    t.plan(1)
    await sheet.addRows([{ id: '4', name: 'qux' }, { id: '5', name: 'quux' }])
    const actual = await sheet.getRows(4, 5)
    const expected = [{ id: '4', name: 'qux' }, { id: '5', name: 'quux' }]
    t.deepEqual(actual, expected)
  })
})
