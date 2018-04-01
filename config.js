const fs = require('fs')
const env = process.env.NODE_ENV || 'development'

function getConfig () {
  let content = fs.readFileSync('./config/config.json')
  return JSON.parse(content)[env]
}

module.exports = { getConfig }
