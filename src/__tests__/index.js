const test = require('tape')
const createGoogleSheets = require('..')

const options = {
  id: '116rzvqotNCvAUselqAELxM_tLdVl-fDtG_xg_pjeu0A',
  serviceAccountCredentials: {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
  },
  sheetName: 'Sheet1'
}

test('read rows', async function (t) {
  t.plan(1)
  const googleSheets = await createGoogleSheets(options)
  const actual = await googleSheets.readRows(1, 3)
  const expected = [
    { id: '1', name: 'foo' },
    { id: '2', name: 'bar' },
    { id: '3', name: 'baz' }
  ]
  t.deepEqual(actual, expected)
})

test('append rows', async function (t) {
  t.plan(1)
  const googleSheets = await createGoogleSheets(options)
  await googleSheets.appendRows([
    { id: '4', name: 'qux' },
    { id: '5', name: 'quux' }
  ])
  t.pass()
})
