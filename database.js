const mysql = require('promise-mysql')
const Hashes = require('jshashes')
const randomstring = require('randomstring')
const Sequelize = require('sequelize')

let SHA512 = new Hashes.SHA512()

let connectionPromise = mysql.createConnection({
  host: 'localhost',
  password: '123',
  database: 'habitude',
  user: 'root',
  timezone: 'UTC'
})

connectionPromise.catch(err => {
  console.error('error connecting: ' + err.stack)
})

class AlreadyExistsError extends Error {}

class Database {
  constructor () {
    this.sequelize = new Sequelize('habitude-2', 'root', '123', {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    })

    this.User = this.sequelize.define('users', {
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      salt: Sequelize.STRING
    })

    this.Habit = this.sequelize.define('habits', {
      name: Sequelize.STRING
    })

    this.Habit.belongsTo(this.User)
    this.User.hasMany(this.Habit)

    this.HabitDate = this.sequelize.define('dates', {
      date: Sequelize.DATEONLY
    })

    this.HabitDate.belongsTo(this.Habit)
    this.Habit.hasMany(this.HabitDate, { as: 'dates' })
  }

  sync () {
    return Promise.all([
      this.User.sync(),
      this.Habit.sync(),
      this.HabitDate.sync()
    ])
  }

  test () {
    return this.sequelize.authenticate()
  }

  async checkUser (login, password) {
    let user = await this.User.findOne({ where: { login } })
    if (user) {
      if (SHA512.hex(password + user.salt) === user.password) {
        return user.id
      }
    }
    return null
  }

  async getUsersHabits (userId) {
    return this.Habit.findAll({ where: {userId} })
  }

  async getHabit (id) {
    return this.Habit.findOne({ where: { id } })
  }

  async register (login, password) {
    let user = await this.User.findOne({ where: { login } })

    if (user) {
      throw new AlreadyExistsError()
    }
    let salt = randomstring.generate(32)
    password = SHA512.hex(password + salt)

    user = await this.User.create({
      login,
      password,
      salt
    })

    return user.id
  }

  async addNewHabit (name, userId) {
    let habit = await this.Habit.create({name, userId})
    return habit.id
  }

  addDate (date, habitId) {
    return this.HabitDate.create({date, habitId})
  }

  deleteDate (date, habitId) {
    return connectionPromise.then(connection => {
      return connection.query('DELETE FROM dates WHERE date = ? AND habit_id = ?', [date, habitId]).then(res => {
        return res
      })
    })
  }

  checkDate (date, habitId) {
    return connectionPromise.then(connection => {
      return connection.query('SELECT * FROM dates WHERE date = ? AND habit_id = ?', [date, habitId]).then(res => {
        if (res[0]) {
          return true
        } else {
          return false
        }
      }).catch(err => {
        return err
      })
    })
  }

  getDates (firstDate, lastDate, habitId) {
    //this.HabitDate.findAll({where: {}})
    return connectionPromise.then(connection => {
      return connection.query('SELECT * FROM dates WHERE date <= ? AND date >= ? AND habit_id = ? ORDER BY date', [firstDate, lastDate, habitId]).then(res => {
        return res
      }).catch(err => {
        return err
      })
    })
  }

  deleteHabit (id) {
    return connectionPromise.then(connection => {
      return connection.query('DELETE FROM habits WHERE id = ?', [id])
    })
  }

  changeHabitName (id, name) {
    return connectionPromise.then(connection => {
      return connection.query('UPDATE habits SET name = ? WHERE id = ?', [name, id]).then(res => {
        return res
      })
    })
  }
}

module.exports = {Database, AlreadyExistsError}
