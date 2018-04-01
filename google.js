const google = require('googleapis')
const OAuth2 = google.auth.OAuth2
const plus = google.plus('v1')
const { getConfig } = require('./config')

const config = getConfig().google
let oauth2Client = new OAuth2(
  config.apiKey, config.apiSecret, config.redirect
)

let scopes = ['https://www.googleapis.com/auth/plus.me', 'email']

function generateAuthUrl () {
  return oauth2Client.generateAuthUrl({
    scope: scopes
  })
}

function getEmailByCode (code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, function (err, tokens) {
      if (!err) {
        oauth2Client.setCredentials(tokens)

        plus.people.get({
          userId: 'me',
          auth: oauth2Client
        }, async function (err, response) {
          if (err) {
            return reject(err)
          }
          let email = response.emails[0].value
          resolve(email)
        })
      } else {
        reject(err)
      }
    })
  })
}

module.exports = { generateAuthUrl, getEmailByCode }
