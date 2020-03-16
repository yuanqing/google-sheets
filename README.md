# @yuanqing/google-sheets [![npm Version](https://badgen.net/npm/v/@yuanqing/google-sheets)](https://www.npmjs.org/package/@yuanqing/google-sheets) [![Build Status](https://badgen.net/travis/yuanqing/google-sheets?label=build)](https://travis-ci.org/yuanqing/google-sheets)

> An easier interface to read from and write to Google Sheets

## Quick start

```sh
$ yarn add @yuanqing/google-sheets
```

```js
const { getSpreadsheet } = require('@yuanqing/google-sheets')

async function main () {
  const serviceAccountCredentials = {
    clientEmail: '<client_email>',
    priateKey: '<private_key>'
  }
  const spreadsheetId = '<spreadsheet_id>'
  const sheetName = '<sheet_name>'
  const spreadsheet = await getSpreadsheet(
    serviceAccountCredentials,
    spreadsheetId
  )
  const sheet = await spreadsheet.getSheet(sheetName)
  const rows = await sheet.getAllRows()
  console.log(rows)
}

await main()
```

- **`<client_email>`** and **`<private_key>`** are credentials for a Service Account with edit access to your spreadsheet. See [Initial setup](#initial-setup).
- **`<spreadsheet_id>`** is the value between `/d/` and `/edit` in your spreadsheet URL.
- **`<sheet_name>`** is the name of the sheet that you want to read from or write to.

### Initial setup

<details>
<summary>1. Create a Service Account on the Google API Console.</summary>
<p>

1. Navigate to [the Google API Console](https://console.developers.google.com/apis/dashboard)
2. Select a project from the drop-down box in the top bar.
3. Click **`Credentials`** (the Key icon) on the left navigation bar.
4. Click the **`Create credentials`** drop-down box, and select **`Service account key`**.
5. Click the **`Select…`** drop-down box, and select **`New service account`**. Enter a **`Service account name`**. For **`Role`**, select **`Project › Editor`**.
6. For **`Key type`**, select **`JSON`**.
7. Click the **`Create`** button. A JSON file with the Service Account credentials will be generated. Note the `client_email` and `private_key` values in the generated JSON file.

</p>
</details>

<details>
<summary>2. Grant the Service Account edit access to your spreadsheet.</summary>
<p>

1. Navigate to your spreadsheet.
2. Click the **`Share`** button on the top-right corner of the page.
3. In the **`Enter names or email addresses…`** text box, enter the `client_email` of the Service Account, then click the **`Send`** button.

</p>
</details>

### Assumptions

1. Data is row-based. Each field is stored on a column.
2. Row 1 of the sheet contains the headers for the data. “Actual” data starts from Row 2.

[![Google Sheets](/media/header.png)](https://docs.google.com/spreadsheets/d/1ur-Bd1PBUpkXs18u4VeSy85q9wSYf2db9hUi73aWbSY/edit#gid=0)

> [**Example spreadsheet**](https://docs.google.com/spreadsheets/d/1ur-Bd1PBUpkXs18u4VeSy85q9wSYf2db9hUi73aWbSY/edit#gid=0)

## API

```js
const { createSpreadsheet, getSpreadsheet } = require('@yuanqing/google-sheets')
```

### Spreadsheet

#### const spreadsheet = await createSpreadsheet(serviceAccountCredentials)

Creates a new spreadsheet and returns a Promise for it.

- `serviceAccountCredentials` is an object literal with the following keys:

    Key | Description
    :-|:-
    `clientEmail` | Email address of the Service Account that has edit access to the spreadsheet.
    `privateKey` | Private key of the Service Account.

#### const spreadsheet = await getSpreadsheet(serviceAccountCredentials, spreadsheetId)

Returns a Promise for an existing spreadsheet.

- `spreadsheetId` is the value between `/d/` and `/edit` in the spreadsheet URL.

#### const sheet = await spreadsheet.createSheet(spreadsheetName, headers)

Creates a new sheet and returns a Promise for it.

- `spreadsheetName` is the name of the new sheet.
- `headers` is an array of headers for the new sheet.

#### const sheet = await spreadsheet.getSheet(spreadsheetName)

Returns a Promise for an existing sheet.

### Sheet

#### const rows = await sheet.getAllRows()

Returns a Promise for an array containing all the `rows` from the `sheet`.

#### const rows = await sheet.getRowsByRange(m, n)

Returns a Promise for an array containing `rows` from the row `m` to row `n` of the `sheet`.

Data rows are zero-indexed. For example, pass in `(0, 1)` to delete rows 2 and 3 in the `sheet`.

#### await sheet.addRows(rows)

Appends the given array of `rows` to the `sheet`, and returns a Promise that resolves.

#### const deletedRows = await sheet.deleteRows(predicate)

Deletes rows in the `sheet` that satisfy the given `predicate`, and returns a Promise for an array containing the deleted rows.

## Installation

```sh
$ yarn add @yuanqing/google-sheets
```

## License

[MIT](LICENSE.md)
