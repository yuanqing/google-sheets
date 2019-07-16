const fetch = require('isomorphic-unfetch')
const createAccessToken = require('./create-access-token')

const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`

async function createApiClient (serviceAccountCredentials) {
  const accessToken = await createAccessToken(serviceAccountCredentials)
  return async function (method, urlSuffix, body) {
    const url = [BASE_URL, urlSuffix].filter(Boolean).join('/')
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: body ? JSON.stringify(body) : null
    })
    const json = await response.json()
    if (json.error) {
      throw new Error(json.error.message)
    }
    return json
  }
}

module.exports = createApiClient
