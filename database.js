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
    this.User.hasMany(this.Habit, {onDelete: 'cascade'})

    this.HabitDate = this.sequelize.define('dates', {
      date: Sequelize.DATEONLY
    })

    this.HabitDate.belongsTo(this.Habit)
    this.Habit.hasMany(this.HabitDate, { as: 'dates', onDelete: 'cascade' })
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

  async addDate (date, habitId) {
    return this.HabitDate.create({date, habitId})
  }

  async deleteDate (date, habitId) {
    return this.HabitDate.destroy({ where: {date, habitId} })
  }

  async checkDate (date, habitId) {
    return this.HabitDate.findOne({ where: {date, habitId} })
  }

  async getDates (firstDate, lastDate, habitId) {
    return this.HabitDate.findAll({ where: {
      habitId,
      $and: [
        {date: {lte: firstDate}},
        {date: {gte: lastDate}}
      ]
    }
    })
  }

  async deleteHabit (id) {
    return this.Habit.destroy({ where: {id} })
  }

  async changeHabitName (id, name) {
    return this.Habit.update({ name }, {
      where: {id}
    })
  }
}

module.exports = {Database, AlreadyExistsError}
