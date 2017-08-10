export class HabitsService {
  constructor ($http) {
    this.$http = $http
  }

  getUserHabits () {
    return this.$http.get('/api/habits').then(response => {
      return response.data
    }).catch(error => {
      console.error('problem with getting habits', error.body)
    })
  }

  addDate (date, habitId) {
    return this.$http.post('/api/habits/' + habitId + '/dates', {date}).then(response => {
      return response.data
    })
  }

  deleteDate (date, habitId) {
    return this.$http.delete('/api/habits/' + habitId + '/dates/' + date.toISOString()).then(response => {
      return response.data
    })
  }

  addNewHabit (habitName) {
    return this.$http.post('/api/habits', {name: habitName})
  }

  deleteHabit (habit) {
    return this.$http.delete('/api/habits/' + habit.id)
  }
}
