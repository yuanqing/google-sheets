class Sheet {
  async createSheet (sheetName, headers, request) {
    this.sheetName = sheetName
    this.headers = headers
    this.request = request
    // https://developers.google.com/sheets/api/samples/sheet#add_a_sheet
    const addSheetResult = await this.request('POST', ':batchUpdate', {
      requests: [
        {
          addSheet: {
            properties: {
              title: this.sheetName
            }
          }
        }
      ]
    })
    this.sheetId = addSheetResult.replies[0].addSheet.properties.sheetId
    // https://developers.google.com/sheets/api/samples/writing#write_a_single_range
    const range = `${this.sheetName}!1:1`
    const addHeadersResult = await this.request(
      'PUT',
      `/values/${range}?valueInputOption=USER_ENTERED`,
      {
        range,
        majorDimension: 'ROWS',
        values: [headers]
      }
    )
    this.columnRange = addHeadersResult.updatedRange.match(/!(\S+)/)[1]
    return this
  }

  async deleteSheet () {
    // https://developers.google.com/sheets/api/samples/sheet#delete_a_sheet
    return this.request('POST', ':batchUpdate', {
      requests: [
        {
          deleteSheet: {
            sheetId: this.sheetId
          }
        }
      ]
    })
  }

  async getRows (startIndex, endIndex) {
    // https://developers.google.com/sheets/api/samples/reading#read_a_single_range
    const json = await this.request(
      'GET',
      `/values/${this.sheetName}!${startIndex + 1}:${endIndex + 1}`
    )
    return this.mapArrayToObject(json.values)
  }

  async addRows (rows) {
    const range = `${this.sheetName}!${this.columnRange}`
    // https://developers.google.com/sheets/api/samples/writing#append_values
    await this.request(
      'POST',
      `/values/${range}:append?valueInputOption=USER_ENTERED`,
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
