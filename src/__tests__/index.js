const nanoid = require('nanoid')
const test = require('tape')

const { createSpreadsheet, getSpreadsheet } = require('..')

const id = '116rzvqotNCvAUselqAELxM_tLdVl-fDtG_xg_pjeu0A'
const serviceAccountCredentials = {
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY
}

test('get spreadsheet', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(serviceAccountCredentials, id)
  t.true(spreadsheet.id)
})

test('create spreadsheet', async function (t) {
  t.plan(1)
  const spreadsheet = await createSpreadsheet(serviceAccountCredentials)
  t.true(spreadsheet.id)
})

test('get sheet', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(serviceAccountCredentials, id)
  const sheet = await spreadsheet.getSheet('Sheet1')
  t.equal(sheet.id, '0')
})

test('get rows', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(serviceAccountCredentials, id)
  const sheet = await spreadsheet.getSheet('Sheet1')
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
  const spreadsheet = await createSpreadsheet(serviceAccountCredentials)
  const sheet = await spreadsheet.createSheet(nanoid(), ['id', 'name'])
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
})
