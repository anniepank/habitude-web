const express = require('express')
const {Database, AlreadyExistsError} = require('./database')
const bodyParser = require('body-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

let app = express()
let database = new Database()

let databaseOptions = {
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'habitude'
}

let sessionStore = new MySQLStore(databaseOptions)

function error (err, res) {
  res.status(500)
  res.end(err.toString())
  console.error(err)
}

app.use(session({
  secret: 'kek',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.json({limit: 999999999}))

function sendHtml (req, res) {
  res.sendFile(__dirname + '/client/index.html') // eslint-disable-line
}

app.get('/', sendHtml)
app.get('/loginPage', sendHtml)
app.get('/registrationPage', sendHtml)

app.get('/client/:filename', (req, res) => {
  res.sendFile(__dirname + '/client/' + req.params.filename) // eslint-disable-line
})

app.listen(9000)

app.post('/api/login', (req, res) => {
  database.checkUser(req.body.login, req.body.password, (err, result) => {
    // result = id || null
    if (err) {
      return error(err, res)
    }
    if (result) {
      req.session.userid = result
      res.status(200)
    } else {
      res.status(401)
    }
    res.end()
  })
})

app.post('/api/registration', (req, res) => {
  database.register(req.body.login, req.body.password, (err, userId) => {
    if (err instanceof AlreadyExistsError) {
      res.status(409)
    } else if (err) {
      return error(err, res)
    } else {
      req.session.userid = userId
    }
    res.end()
  })
})

app.get('/api/userHabits', (req, res) => {
  database.getUsersHabits(req.session.userid, (err, habits) => {
    if (err) {
      return error(err, res)
    }
    res.json(habits)
  })
})

app.get('/api/loggedIn', (req, res) => {
  if (req.session.userid) {
    res.send('true')
  } else {
    res.send('false')
  }
})

app.get('/api/stopSession', (req, res) => {
  if (req.session.userid) {
    req.session.userid = null
    res.send('true')
  } else {
    res.send('false')
  }
})
