export class AuthenticationService {
  constructor ($http) {
    this.$http = $http
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
      return response.data
    })
  }
}
