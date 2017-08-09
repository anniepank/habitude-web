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
  database.checkUser(req.body.login, req.body.password).then(result => {
    if (result) {
      req.session.userid = result
      res.status(200)
      res.end()
    } else {
      res.status(401)
      res.end()
    }
  })
})

app.post('/api/registration', (req, res) => {
  database.register(req.body.login, req.body.password).then(result => {
    req.session.userid = result
    res.end()
  }).catch(err => {
    if (err instanceof AlreadyExistsError) {
      res.status(409)
      res.end()
    }
  })
})

app.get('/api/userHabits', (req, res) => {
  database.getUsersHabits(req.session.userid).then(habits => {
    let arrayOfPromises = []
    for (let i = 0; i < habits.length; i++) {
      let today = new Date()
      let lastDay = new Date()
      lastDay.setDate(lastDay.getDate() - 5)
      let promise = database.getDates(today, lastDay, habits[i].id).then(dates => {
        habits[i].dates = dates
      })
      arrayOfPromises.push(promise)
    }
    Promise.all(arrayOfPromises).then(() => {
      res.json(habits)
    }).catch(err => {
      error(err, res)
    })
  })
})

app.get('/api/loggedIn', (req, res) => {
  if (req.session.userid) {
    res.json(true)
  } else {
    res.json(false)
  }
})

app.get('/api/logout', (req, res) => {
  if (req.session.userid) {
    req.session.userid = null
    res.json(true)
  } else {
    res.json(false)
  }
})

app.post('/api/addNewHabit', (req, res) => {
  let habit = {name: req.body.name}
  database.addNewHabit(req.body.name, req.session.userid).then(habitId => {
    habit.id = habitId
    res.json(habit)
  })
})

app.post('/api/addDate', (req, res) => {
  let date = new Date(req.body.date)
  database.addDate(date, req.body.habitId).then(result => {
    res.json(result)
  })
})

app.post('/api/deleteDate', (req, res) => {
  let date = new Date(req.body.date)
  database.deleteDate(date, req.body.habitId).then(result => {
    res.json(result)
  })
})
