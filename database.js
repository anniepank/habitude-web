const mysql = require('promise-mysql')
const Hashes = require('jshashes')
const randomstring = require('randomstring')

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
  checkUser (login, password) {
    return connectionPromise.then(connection => {
      return connection.query('SELECT id, password, salt FROM users WHERE login = ?', [login])
    }).then(results => {
      if (results.length !== 0) {
        if (SHA512.hex(password + results[0].salt) === results[0].password) {
          return results[0].id
        }
        return null
      } else {
        return null
      }
    })
  }

  getUsersHabits (userid) {
    return connectionPromise.then(connection => {
      return connection.query(`SELECT * FROM habits WHERE userid = ?`, [userid]).then(results => {
        return results
      })
    })
  }

  getHabit (id) {
    return connectionPromise.then(connection => {
      return connection.query('SELECT * FROM habits WHERE id = ?', [id]).then(results => {
        return results[0]
      })
    })
  }

  register (login, password) {
    return connectionPromise.then(connection => {
      return connection.query(`SELECT COUNT(*) AS e FROM users WHERE login = ? `, [login]).then(res => {
        if (res[0].e) {
          throw new AlreadyExistsError()
        } else {
          let salt = randomstring.generate(32)
          password = SHA512.hex(password + salt)
          return connection.query(`INSERT INTO users (login, password, salt) VALUES (?, ?, ?)`, [login, password, salt])
        }
      }).then(results => {
        return results.insertId
      })
    })
  }

  addNewHabit (name, userid) {
    return connectionPromise.then(connection => {
      return connection.query('INSERT INTO habits (name, userid) VALUES (?, ?)', [name, userid]).then(res => {
        return res.insertId
      }).catch(err => {
        return err
      })
    })
  }

  addDate (date, habitId) {
    return connectionPromise.then(connection => {
      return connection.query('INSERT INTO dates (date, habit_id) VALUES (?, ?)', [date, habitId]).then(res => {
        return res
      })
    })
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
