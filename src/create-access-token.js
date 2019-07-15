const JWT = require('google-auth-library').JWT

const scopes = ['https://spreadsheets.google.com/feeds']

async function createAccessToken (serviceAccountCredentials) {
  const jwtClient = new JWT({
    email:
      serviceAccountCredentials.clientEmail ||
      serviceAccountCredentials.client_email,
    key:
      serviceAccountCredentials.privateKey ||
      serviceAccountCredentials.private_key,
    scopes
  })
  const accessToken = await jwtClient.authorize()
  return accessToken.access_token
}

module.exports = createAccessToken
