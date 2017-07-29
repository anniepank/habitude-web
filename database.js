const mysql = require('mysql')
const Hashes = require('jshashes')
const randomstring = require("randomstring")

let SHA512 = new Hashes.SHA512()

let connection = mysql.createConnection({
  host: 'localhost',
  password: '123',
  database: 'habitude',
  user: 'root'
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
    connection.query(`SELECT id, name FROM habits WHERE userid = ? `, [userid], (err, res) => {
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
}

module.exports = {Database, AlreadyExistsError}
