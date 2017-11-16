const fs = require('fs')

function getDatabaseConfig () {
  let content = fs.readFileSync('./config/config.json')
  return JSON.parse(content).development
}

module.exports = { getDatabaseConfig }

//  108510044966-3s2ohehglcafecfs4qvpdjome4sdf7j8.apps.googleusercontent.com
//  nrWvzSD6McEd9wWWEzle8s1r
