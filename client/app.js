import * as angular from 'angular'
import '@uirouter/angularjs'
import {navbarComponent} from './components/navbar.component'
import {AuthenticationService} from './services/authenticationService'
let app = angular.module('habitude', ['ui.router'])

app.controller('MainController', function (authentication) {
  this.login = function (login, password) {
    authentication.login(login, password).then(result => {
      if (result) {

      } else {
        console.error('error with login')
      }
    })
  }
})

app.service('authentication', AuthenticationService)
app.component('navbar', navbarComponent)
