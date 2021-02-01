const Options = require('./options')

class Sheet {
  constructor (
    request,
    spreadsheetId,
    sheetId,
    sheetName,
    headers,
    columnRange
  ) {
    this.request = request
    this.spreadsheetId = spreadsheetId
    this.sheetId = sheetId
    this.sheetName = sheetName
    this.headers = headers
    this.columnRange = columnRange
  }

  async getAllRows (options = new Options()) {
    // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
    const queryParameters = [
      `ranges=${this.sheetName}!${this.columnRange.start}:${this.columnRange.end}`,
      'majorDimension=ROWS',
      options.formattedValues ? 'valueRenderOption=FORMATTED_VALUE' : 'valueRenderOption=UNFORMATTED_VALUE'
    ]
    const json = await this.request(
      'GET',
      `${this.spreadsheetId}/values:batchGet?${queryParameters.join('&')}`
    )
    return this.mapArrayToObject(json.valueRanges[0].values).slice(1)
  }

  async getRowsByRange (startIndex, endIndex, options = new Options()) {
    // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
    const queryParameters = [
      `ranges=${this.sheetName}!${startIndex + 2}:${endIndex + 2}`,
      'majorDimension=ROWS',
      options.formattedValues ? 'valueRenderOption=FORMATTED_VALUE' : 'valueRenderOption=UNFORMATTED_VALUE'
    ]
    const json = await this.request(
      'GET',
      `${this.spreadsheetId}/values:batchGet?${queryParameters.join('&')}`
    )
    return this.mapArrayToObject(json.valueRanges[0].values)
  }

  async addRows (rows) {
    const range = `${this.sheetName}!${this.columnRange.start}:${this.columnRange.end}`
    // https://developers.google.com/sheets/api/samples/writing#append_values
    await this.request(
      'POST',
      `${this.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        range,
        majorDimension: 'ROWS',
        values: this.mapObjectToArray(rows)
      }
    )
    return Promise.resolve(rows)
  }

  async deleteRows (predicate) {
    // https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
    const rows = await this.getAllRows()
    const indices = []
    const deletedRows = []
    rows.forEach(function (value, index) {
      if (predicate(value) === true) {
        indices.push(index)
        deletedRows.push(value)
      }
    })
    if (indices.length === 0) {
      return []
    }
    const sheetId = this.sheetId
    let deletedCount = -1
    const requests = indices.map(function (index) {
      deletedCount++
      return {
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: index + 1 - deletedCount,
            endIndex: index + 2 - deletedCount
          }
        }
      }
    })
    await this.request('POST', `${this.spreadsheetId}:batchUpdate`, {
      requests
    })
    return deletedRows
  }

  async deleteSheet () {
    // https://developers.google.com/sheets/api/samples/sheet#delete_a_sheet
    return this.request('POST', `${this.spreadsheetId}:batchUpdate`, {
      requests: [
        {
          deleteSheet: {
            sheetId: this.sheetId
          }
        }
      ]
    })
  }

  mapArrayToObject (arrays) {
    const headers = this.headers
    return arrays.map(function (array) {
      const object = {}
      headers.forEach(function (header, index) {
        if (!header || header.length === 0) {
          return
        }
        object[header] = array[index]
      })
      return object
    })
  }

  mapObjectToArray (objects) {
    const headers = this.headers
    return objects.map(function (object) {
      return headers.map(function (header) {
        return object[header] || ''
      })
    })
  }
}

module.exports = Sheet
