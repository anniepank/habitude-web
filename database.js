const Hashes = require('jshashes')
const randomstring = require('randomstring')
const Sequelize = require('sequelize')
const { getConfig } = require('./config')

let SHA512 = new Hashes.SHA512()

class AlreadyExistsError extends Error {}

class Database {
  constructor () {
    let config = getConfig()

    this.sequelize = new Sequelize(config.database, config.username, config.password, {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    })

    this.User = this.sequelize.define('Users', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
      },
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      salt: Sequelize.STRING,
      appKey: Sequelize.STRING

    })

    this.Habit = this.sequelize.define('Habits', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
      },
      name: Sequelize.STRING,
      userId: {
        type: Sequelize.DataTypes.UUID,
        refereces: {model: 'Users', key: 'id'}
      },
      deleted: Sequelize.BOOLEAN
    })

    this.User.hasMany(this.Habit, {onDelete: 'cascade'})

    this.HabitDate = this.sequelize.define('Dates', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
      },
      date: Sequelize.DataTypes.INTEGER,
      habitId: {
        type: Sequelize.DataTypes.UUID,
        refereces: {model: 'Habits', key: 'id'}
      },
      deleted: Sequelize.BOOLEAN

    })

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
    return this.Habit.findAll({ where: {
      userId,
      deleted: false
    }
    })
  }

  async getHabit (id) {
    return this.Habit.findOne({ where: { id } })
  }

  async registerByEmail (email) {
    let user = await this.User.findOne({ where: { login: email } })

    if (user) {
      throw new AlreadyExistsError()
    }

    user = await this.User.create({
      login: email
    })

    return user
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
    let habitDate = await this.HabitDate.findOne({ where: {date, habitId} })
    if (habitDate) {
      habitDate.deleted = false
      await habitDate.save()
      return habitDate
    }
    return this.HabitDate.create({date, habitId})
  }

  async deleteDate (date, habitId) {
    return this.HabitDate.update({deleted: true}, {
      where: {date, habitId}
    })
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
      ],
      deleted: false
    }
    })
  }

  async deleteHabit (id) {
    return this.Habit.update({deleted: true}, {
      where: {id}
    })
  }

  async changeHabitName (id, name) {
    return this.Habit.update({ name }, {
      where: {id}
    })
  }
}

module.exports = {Database, AlreadyExistsError}
