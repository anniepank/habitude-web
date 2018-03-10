const express = require('express')
const {Database, AlreadyExistsError} = require('./database')
const bodyParser = require('body-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { getDatabaseConfig } = require('./config')
const epilogue = require('epilogue')
const google = require('./google')
const randomstring = require('randomstring')
const { getToday } = require('./utilities')

let app = express()
let database = new Database()
let config = getDatabaseConfig()

let sessionStore = new MySQLStore(Object.assign({
  user: config.username
}, config))

epilogue.initialize({
  app: app,
  sequelize: database.sequelize
})

epilogue.resource({
  model: database.Habit,
  associations: true,
  endpoints: ['/new-habits', '/new-habits/:id']
})

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
app.get('/habit/:id', sendHtml)

app.get('/client/:filename(*)', (req, res) => {
  res.sendFile(__dirname + '/client/' + req.params.filename) // eslint-disable-line
})

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

app.get('/api/google-login', (req, res) => {
  req.session.appLogin = false
  res.redirect(google.generateAuthUrl())
  res.end()
})

app.get('/api/app-google-login', (req, res) => {
  req.session.appLogin = true
  res.redirect(google.generateAuthUrl())
  res.end()
})

app.get('/api/google-redirect', async (req, res) => {
  let code = req.query.code
  let email
  try {
    email = await google.getEmailByCode(code)
  } catch (err) {
    return error(err, res)
  }

  let user = await database.User.findOne({ where: { login: email } })
  if (!user) {
    user = await database.registerByEmail(email)
  }

  if (!user.appKey) {
    user.appKey = randomstring.generate(45)
    user.save()
  }

  if (req.session.appLogin) {
    res.redirect('/appKey/' + user.appKey)
  } else {
    req.session.userid = user.id
    res.redirect('/')
  }
  res.end()
})

app.get('/appKey/:key', (req, res) => res.end())

app.post('/api/registration', (req, res) => {
  database.register(req.body.login, req.body.password).then(result => {
    req.session.userid = result
    res.end()
  }).catch(err => {
    if (err instanceof AlreadyExistsError) {
      res.status(409)
      return res.end()
    }
    error(err, res)
  })
})

app.post('/api/synchronize', async (req, res) => {
  let user = await database.User.findOne({ where: { appKey: req.body.key } })

  let dbHabits = await database.Habit.findAll({ where: {
    userId: user.id
  }
  })

  let appUpdates = {}
  let habitUpdates = []
  let dateUpdates = []

  for (let habitInApp of req.body.habits) {
    let dbHabit = dbHabits.find(x => x.id === habitInApp.id)

    if (dbHabit) {
      if (dbHabit.name !== habitInApp.name || dbHabit.deleted !== habitInApp.deleted) {
        if (dbHabit.updatedAt.getTime() > habitInApp.updatedAt) {
          console.log('Sync habit to app: ' + dbHabit.name)
          habitUpdates.push({
            inApp: true,
            habit: dbHabit
          })
        } else if (habitInApp.updatedAt > dbHabit.updatedAt.getTime()) {
          console.log('Sync habit here' + dbHabit.name)
          dbHabit.name = habitInApp.name
          dbHabit.deleted = habitInApp.deleted
          dbHabit.save()
        }
      }

      let dbDates = await database.HabitDate.findAll({ where: {
        habitId: dbHabit.id
      }})

      if (dbDates && !dbHabit.deleted) {
        for (let dateInApp of habitInApp.days) {
          let dbDate = dbDates.find(x => x.id === dateInApp.id)

          if (dbDate) {
            if (dbDate.deleted !== dateInApp.deleted) {
              if (dbDate.updatedAt.getTime() > dateInApp.updatedAt) {
                console.log('\n' + '!!PUSH!! Adding date to app habit ' + dbHabit.name + ' day: ' + dbDate.date + 'IN APP: true')

                dateUpdates.push({
                  date: {
                    id: dbDate.id,
                    habitId: dbDate.habitId,
                    date: dbDate.date,
                    deleted: dbDate.deleted
                  },
                  inApp: true
                })
              } else if (dateInApp.updatedAt > dbDate.updatedAt.getTime()) {
                console.log('Sync date here' + dbHabit.name + ' day: ' + dbDate)
                dbDate.date = dateInApp.date
                dbDate.deleted = dateInApp.deleted
                dbDate.save()
              }
            }
          } else {
            console.log('Adding day here ' + dateInApp.date + 'of habit ' + dbHabit.name)
            await database.HabitDate.create({
              id: dateInApp.id,
              date: dateInApp.date,
              habitId: dbHabit.id,
              deleted: dateInApp.deleted
            })
          }
        }
      }

      for (let date of dbDates) {
        if (!habitInApp.days.find(x => x.id === date.id)) {
          console.log('\n' + '!!PUSH!! ADDING DATE to app that wasnt there ' + date.date + ' IN APP: false')
          dateUpdates.push({
            date: date,
            inApp: false
          })
        }
      }
    } else {
      console.log('add new habit here', habitInApp.name)

      await database.Habit.create({
        id: habitInApp.id,
        userId: user.id,
        name: habitInApp.name,
        deleted: habitInApp.deleted
      })

      for (let date of habitInApp.days) {
        console.log('Creating date of habit ' + habitInApp.name + ' here ' + date)
        await database.HabitDate.create({
          id: date.id,
          date: date.date,
          habitId: date.habitId,
          deleted: date.deleted
        })
      }
    }
  }

  for (let dbHabit of dbHabits) {
    if (!req.body.habits.find(x => x.id === dbHabit.id)) {
      console.log('add to app', dbHabit.name)
      habitUpdates.push({
        inApp: false,
        habit: dbHabit
      })
    }

    if (dbHabit.deleted) {
      database.HabitDate.findAll({
        where: {
          habitId: dbHabit.id
        }
      }).then(dates => {
        for (let date of dates) {
          date.destroy()
        }
      })
    }
  }

  appUpdates.habits = habitUpdates
  appUpdates.dates = dateUpdates
  res.json(appUpdates)
})

app.get('/api/habits', (req, res) => {
  database.getUsersHabits(req.session.userid).then(habits => {
    let arrayOfPromises = []
    for (let i = 0; i < habits.length; i++) {
      let today = getToday()
      let lastDay = today - 365

      let promise = database.getDates(today, lastDay, habits[i].id).then(dates => {
        habits[i].dates = dates
        console.log('got this date from db: ' + dates)
        console.log(today + ' ' + lastDay)
      })
      arrayOfPromises.push(promise)
    }
    Promise.all(arrayOfPromises).then(() => {
      habits = habits.map(habit => {
        let j = habit.toJSON()
        j.dates = habit.dates
        return j
      })
      res.json(habits)
    }).catch(err => {
      error(err, res)
    })
  })
})

app.get('/api/habits/:id', (req, res) => {
  database.getHabit(req.params.id).then(habit => {
    let today = getToday()
    let lastDay = today - 365

    database.getDates(today, lastDay, habit.id).then(dates => {
      habit = habit.toJSON()
      habit.dates = dates
      res.json(habit)
    })
  }).catch(err => {
    error(err, res)
  })
})

app.put('/api/habits/:id', (req, res) => {
  database.changeHabitName(req.params.id, req.body.name).then(result => {
    res.json(result)
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

app.post('/api/habits', (req, res) => {
  let habit = {name: req.body.name}
  database.addNewHabit(req.body.name, req.session.userid).then(habitId => {
    habit.id = habitId
    habit.dates = []
    res.status(201)
    res.json(habit)
  })
})

app.post('/api/habits/:id/dates', (req, res) => {
  let date = req.body.date
  database.addDate(date, req.params.id).then(date => {
    res.status(201)
    res.json(date)
  })
})

app.delete('/api/habits/:id/dates/:date', (req, res) => {
  let date = req.params.date
  database.deleteDate(date, req.params.id).then(result => {
    res.status(204)
    res.json(result)
  }).catch(err => {
    error(err, res)
  })
})

app.delete('/api/habits/:id', (req, res) => {
  database.deleteHabit(req.params.id).then(result => {
    res.status(204)
    res.end()
  }).catch(err => {
    error(err, res)
  })
})

database.test().then(() => {
  app.listen(9000)
  console.log('Connection has been established successfully.')
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})
