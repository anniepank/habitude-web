class NavbarController {
  constructor (authentication) {
    this.authentication = authentication
  }

  logout () {
    this.authentication.logout()
  }
}

export const navbarComponent = {
  templateUrl: '/client/navbar.html',
  controller: NavbarController
}
