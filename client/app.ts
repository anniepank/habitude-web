import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserModule } from '@angular/platform-browser';
import 'core-js'
import 'zone.js'
import { NgModule }      from '@angular/core';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'



import { AppComponent }  from './components/app.component';
import { LoginComponent }  from './components/login.component';
import { RegistrationComponent }  from './components/registration.component';
import { NavbarComponent }  from './components/navbar.component';
import { HabitComponent }  from './components/habit.component';
import { MainPageComponent }  from './components/mainPage.component';
import { NewHabitModal } from './components/newHabit.component'
import {routing} from './router/app.routing'

import { AuthService } from './services/authService'
import { HabitsService } from './services/habits.service'



@NgModule({
  imports:      [BrowserModule, routing, HttpModule, NgbModule.forRoot()],
  declarations: [AppComponent, RegistrationComponent, LoginComponent, NavbarComponent, HabitComponent, MainPageComponent,
    NewHabitModal],
  entryComponents: [NewHabitModal],
  bootstrap:    [AppComponent],
  providers:    [AuthService, HabitsService]

})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
/*import * as angular from 'angular'
import '@uirouter/angularjs'
import 'angular-ui-bootstrap'
import {navbarComponent} from './components/navbar.component'
import {AuthenticationService} from './services/authenticationService'
import {HabitsService} from './services/habitsService'
import {loginComponent} from './components/login.component.js'
import {mainComponent} from './components/main.component.js'
import {registrationComponent} from './components/registration.component.js'
import {habitComponent} from './components/habit.component.js'
import {newHabitComponent} from './components/newHabit.component.js'

let app = angular.module('habitude', ['ui.router', 'ui.bootstrap'])

app.service('authentication', AuthenticationService)
app.service('habits', HabitsService)

app.component('navbar', navbarComponent)
app.component('loginView', loginComponent)
app.component('registrationView', registrationComponent)
app.component('mainView', mainComponent)
app.component('habit', habitComponent)
app.component('newHabit', newHabitComponent)

app.config(function ($stateProvider, $locationProvider) {
  let loginState = {
    name: 'login',
    url: '/loginPage',
    component: 'loginView'
  }

  let registrationState = {
    name: 'registration',
    url: '/registrationPage',
    component: 'registrationView'
  }

  let mainState = {
    name: 'main',
    url: '/',
    component: 'mainView'
  }

  $stateProvider.state(loginState)
  $stateProvider.state(registrationState)
  $stateProvider.state(mainState)

  $locationProvider.html5Mode(true)
})
*/
console.log('h')
