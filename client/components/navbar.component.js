class NavbarController {
  constructor (authentication) {
    this.authentication = authentication
  }

  logout () {
    this.authentication.logout()
  }
}

export const navbarComponent = {
  templateUrl: '/client/components/navbar.component.html',
  controller: NavbarController
}
