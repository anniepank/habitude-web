import { Component } from '@angular/core'
import { AuthService } from '../services/authService'
import { Router } from '@angular/router'

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  constructor (public authService: AuthService, private router: Router) {
    this.authService.isLoggedIn().subscribe(res => {
      this.authService.isLoggedIN = res
    })
  }

  onLogout() {
    this.authService.logout().subscribe(res => {
      if (!res) {
        console.log('problem with logging out')
      } else {
        this.authService.isLoggedIN = false
        this.router.navigate(['/'])
      }
    })
  }
}
