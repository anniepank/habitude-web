import { Component } from '@angular/core'
import { AuthService } from '../services/authService'
import { Router } from '@angular/router'

@Component({
  selector: 'login',
  templateUrl: '/client/components/login.component.html'
})
export class LoginComponent {
  constructor (private authService: AuthService, private router: Router) {}

  onLogin (login, password) {
    this.authService.login(login, password).subscribe(res => {
      if (res.status === 200) {
        this.authService.isLoggedIN = true
        this.router.navigate(['/'])
      }
    }, err => {
      if (err.status === 401) {
        window.alert('Wrong password or login')
      }
    })
  }
}
