function dateToInt (date) {
  return Math.floor(date.getTime() / 1000 / 24 / 3600)
}

function intToDate (int) {
  return new Date(int * 3600 * 24 * 1000)
}

function getToday () {
  return dateToInt(new Date())
}

module.exports = {dateToInt, intToDate, getToday}
