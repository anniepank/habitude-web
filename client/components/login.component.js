class LoginController {
  constructor (authentication, $state) {
    this.authentication = authentication
    this.$state = $state
  }

  login (login, password) {
    this.authentication.login(login, password).then(result => {
      if (result) {
        this.$state.go('main')
      } else {
        console.error('error with login')
      }
    })
  }
}

export const loginComponent = {
  templateUrl: '/client/components/login.component.html',
  controller: LoginController
}
