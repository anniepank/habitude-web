import { Component } from '@angular/core';
import { AuthService } from '../services/authService'
import { Router } from '@angular/router'

@Component({
  selector: 'registration',
  templateUrl: '/client/components/registration.component.html',
  styles: [require<string>('./login.component.scss')]
})
export class RegistrationComponent {
  constructor (private authService: AuthService, private router: Router) {}

  onRegister (login, password) {
    this.authService.register(login, password).subscribe(res => {
      this.router.navigate(['/'])
      window.alert('registered!')
    }, err => {
      if (err.status === 409) {
        window.alert('Login already exists')
      }
    })
  }
}
