const fetch = require('isomorphic-unfetch')
const createAccessToken = require('./create-access-token')

async function createGoogleSheets ({
  id,
  serviceAccountCredentials,
  sheetName
}) {
  if (id == null) {
    throw new Error('Need a spreadsheet ID')
  }
  if (serviceAccountCredentials == null) {
    throw new Error('Need service account credentials')
  }
  return new GoogleSheets().initialise(id, serviceAccountCredentials, sheetName)
}

class GoogleSheets {
  async initialise (id, serviceAccountCredentials, sheetName = 'Sheet1') {
    this.id = id
    this.accessToken = await createAccessToken(serviceAccountCredentials)
    this.sheetName = sheetName
    const json = await this.request('GET', '1:1')
    this.headers = json.values[0]
    this.range = json.range.match(/!(\S+)/)[1]
    return this
  }

  async request (method, suffix, body) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${
      this.id
    }/values/${this.sheetName}!${suffix}`
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      body: body ? JSON.stringify(body) : null
    })
    const json = await response.json()
    if (json.error) {
      throw new Error(json.error.message)
    }
    return json
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

  async readRows (startIndex, endIndex) {
    const json = await this.request('GET', `${startIndex + 1}:${endIndex + 1}`)
    return this.mapArrayToObject(json.values)
  }

  async appendRows (rows) {
    await this.request(
      'POST',
      `${this.range}:append?valueInputOption=USER_ENTERED`,
      {
        range: `${this.sheetName}!${this.range}`,
        majorDimension: 'ROWS',
        values: this.mapObjectToArray(rows)
      }
    )
    return Promise.resolve(rows)
  }
}

module.exports = createGoogleSheets
