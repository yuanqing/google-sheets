const nanoid = require('nanoid')
const test = require('tape')

const { createSpreadsheet, getSpreadsheet } = require('..')

const spreadsheetId = '1HA0GGSMChqhxWB4yKWhO9tWF0qtzmLBRnqSg4dqNy2Y'
const serviceAccountCredentials = {
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY
}

test('create spreadsheet', async function (t) {
  t.plan(1)
  const spreadsheet = await createSpreadsheet(serviceAccountCredentials)
  t.true(spreadsheet.spreadsheetId)
})

test('get spreadsheet', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(
    serviceAccountCredentials,
    spreadsheetId
  )
  t.true(spreadsheet.spreadsheetId)
})

test('get sheet', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(
    serviceAccountCredentials,
    spreadsheetId
  )
  const sheet = await spreadsheet.getSheet('Sheet1')
  t.equal(sheet.sheetId, '0')
})

test('get all rows', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(
    serviceAccountCredentials,
    spreadsheetId
  )
  const sheet = await spreadsheet.getSheet('Sheet1')
  const actual = await sheet.getAllRows()
  const expected = [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
    { id: 3, name: 'baz' }
  ]
  t.deepEqual(actual, expected)
})

test('get rows by range', async function (t) {
  t.plan(1)
  const spreadsheet = await getSpreadsheet(
    serviceAccountCredentials,
    spreadsheetId
  )
  const sheet = await spreadsheet.getSheet('Sheet1')
  const actual = await sheet.getRowsByRange(1, 2)
  const expected = [
    { id: 2, name: 'bar' },
    { id: 3, name: 'baz' }
  ]
  t.deepEqual(actual, expected)
})

test('add rows', async function (t) {
  t.plan(1)
  const spreadsheet = await createSpreadsheet(serviceAccountCredentials)
  const sheet = await spreadsheet.createSheet(nanoid(), ['id', 'name'])
  await sheet.addRows([
    { id: 1, name: 'qux' },
    { id: 2, name: 'quux' },
    { id: 3, name: 'quuux' }
  ])
  const actual = await sheet.getAllRows()
  const expected = [
    { id: 1, name: 'qux' },
    { id: 2, name: 'quux' },
    { id: 3, name: 'quuux' }
  ]
  t.deepEqual(actual, expected)
})

test('delete rows', async function (t) {
  t.plan(2)
  const spreadsheet = await createSpreadsheet(serviceAccountCredentials)
  const sheet = await spreadsheet.createSheet(nanoid(), ['id', 'name'])
  await sheet.addRows([
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
    { id: 3, name: 'baz' },
    { id: 4, name: 'bar' },
    { id: 5, name: 'yy' },
    { id: 6, name: 'zz' }
  ])
  const actualDeletedRows = await sheet.deleteRows(function ({ name }) {
    return name === 'bar'
  })
  const expectedDeletedRows = [
    { id: 2, name: 'bar' },
    { id: 4, name: 'bar' }
  ]
  t.deepEqual(actualDeletedRows, expectedDeletedRows)
  const actualAllRows = await sheet.getAllRows()
  const expectedAllRows = [
    { id: 1, name: 'foo' },
    { id: 3, name: 'baz' },
    { id: 5, name: 'yy' },
    { id: 6, name: 'zz' }
  ]
  t.deepEqual(actualAllRows, expectedAllRows)
})
