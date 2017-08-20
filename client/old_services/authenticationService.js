export class AuthenticationService {
  constructor ($http, $state) {
    this.$http = $http
    this.$state = $state
    this.loggedIn = false
    $http.get('/api/loggedIn').then(response => {
      this.loggedIn = response.data
    })
  }

  login (login, password) {
    return this.$http.post('/api/login', {login, password}).then(response => {
      if (response.status === 200) {
        this.loggedIn = true
      }
      return response.status === 200
    }).catch(error => { //eslint-disable-line
      return false
    })
  }

  logout () {
    return this.$http.get('/api/logout').then(response => {
      this.loggedIn = false
      this.$state.go('main', {}, {reload: true})
      return response.data
    })
  }

  register (login, password) {
    return this.$http.post('/api/registration', {login, password}).then(response => {
      this.$state.go('main')
      this.loggedIn = true
    }).catch(error => {
      if (error.status === 409) {
        window.alert('Login Exits!')
      } else {
        window.alert(error.body)
      }
    })
  }
}
