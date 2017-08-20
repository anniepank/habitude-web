class RegistrationController {
  constructor (authentication, $state) {
    this.authentication = authentication
    this.$state = $state
  }

  register (login, password) {
    this.authentication.register(login, password).then(result => {
      if (result) {
        this.$state.go('main')
      } else {
        console.error('error with registration')
      }
    })
  }
}

export const registrationComponent = {
  templateUrl: '/client/components/registration.component.html',
  controller: RegistrationController
}
