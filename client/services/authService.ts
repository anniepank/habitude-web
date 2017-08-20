import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
  isLoggedIN: boolean

  constructor (private http: Http) {
  }

 login (login, password) {
    return this.http.post('/api/login', {login, password})
  }

  logout () {
    return this.http.get('/api/logout').map(res => res.json())
  }

  isLoggedIn () {
    return this.http.get('/api/loggedIn').map(res => res.json())
  }

  register (login, password) {
    return this.http.post('/api/registration', {login, password})
  }
 }
