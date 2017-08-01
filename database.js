const mysql = require('mysql')
const Hashes = require('jshashes')
const randomstring = require('randomstring')

let SHA512 = new Hashes.SHA512()

let connection = mysql.createConnection({
  host: 'localhost',
  password: '123',
  database: 'habitude',
  user: 'root',
  timezone: 'UTC'
})
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack)
  }
})

class AlreadyExistsError extends Error {}

class Database {
  checkUser (login, password, callback) {
    connection.query('SELECT id, password, salt FROM users WHERE login = ?', [login], (error, results) => {
      if (error) {
        return callback(error)
      }
      if (results.length !== 0) {
        if (SHA512.hex(password + results[0].salt) === results[0].password) {
          return callback(null, results[0].id)
        }
        callback(null, null)
      } else {
        callback(null, null)
      }
    })
  }

  getUsersHabits (userid, callback) {
    connection.query(`SELECT * FROM habits WHERE userid = ? `, [userid], (err, res) => {
      if (err) {
        return callback(err)
      }
      callback(null, res)
    })
  }

  register (login, password, callback) {
    connection.query(`SELECT COUNT(*) AS e FROM users WHERE login = ? `, [login], (err, res) => {
      if (err) {
        return callback(err, null)
      }
      if (res[0].e) {
        return callback(new AlreadyExistsError(), null)
      } else {
        let salt = randomstring.generate(32)
        password = SHA512.hex(password + salt)
        connection.query(`INSERT INTO users (login, password, salt) VALUES (?, ?, ?)`, [login, password, salt], (err, res) => {
          if (err) {
            return callback(err, null)
          }
          callback(null, res.insertId)
        })
      }
    })
  }

  addNewHabit (name, userid, callback) {
    connection.query('INSERT INTO habits (name, userid) VALUES (?, ?)', [name, userid], (err, res) => {
      if (err) {
        return callback(err)
      }
      callback(null, res.insertId)
    })
  }

  addDate (date, habitId, callback) {
    connection.query('INSERT INTO dates (date, habit_id) VALUES (?, ?)', [date, habitId], (err, res) => {
      if (err) {
        return callback(err)
      }
      callback(null, res)
    })
  }

  deleteDate (date, habitId, callback) {
    connection.query('DELETE FROM dates WHERE date = ? AND habit_id = ?', [date, habitId], (err, res) => {
      if (err) {
        return callback(err)
      }
      callback(null, res)
    })
  }

  checkDate (date, habitId, callback) {
    connection.query('SELECT * FROM dates WHERE date = ? AND habit_id = ?', [date, habitId], (err, res) => {
      if (err) {
        return callback(err)
      }
      if (res[0]) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    })
  }

  getDates (firstDate, lastDate, habitId, callback) {
    connection.query('SELECT * FROM dates WHERE date <= ? AND date >= ? AND habit_id = ? ORDER BY date', [firstDate, lastDate, habitId], (err, res) => {
      if (err) {
        return callback(err)
      }
      callback(null, res)
    })
  }
}

module.exports = {Database, AlreadyExistsError}
