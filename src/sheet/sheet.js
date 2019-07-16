class Sheet {
  constructor (request, spreadsheetId, id, name, headers, columnRange) {
    this.request = request
    this.spreadsheetId = spreadsheetId
    this.id = id
    this.name = name
    this.headers = headers
    this.columnRange = columnRange
  }

  async deleteSheet () {
    // https://developers.google.com/sheets/api/samples/sheet#delete_a_sheet
    return this.request('POST', `${this.spreadsheetId}:batchUpdate`, {
      requests: [
        {
          deleteSheet: {
            sheetId: this.id
          }
        }
      ]
    })
  }

  async getRows (startIndex, endIndex) {
    // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
    const json = await this.request(
      'GET',
      `${this.spreadsheetId}/values/${this.name}!${startIndex + 1}:${endIndex +
        1}`
    )
    return this.mapArrayToObject(json.values)
  }

  async addRows (rows) {
    const range = `${this.name}!${this.columnRange}`
    // https://developers.google.com/sheets/api/samples/writing#append_values
    await this.request(
      'POST',
      `${
        this.spreadsheetId
      }/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        range,
        majorDimension: 'ROWS',
        values: this.mapObjectToArray(rows)
      }
    )
    return Promise.resolve(rows)
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
