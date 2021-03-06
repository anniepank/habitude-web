import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import 'core-js'
import 'zone.js'
import { NgModule } from '@angular/core'
import { HttpModule } from '@angular/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import './button-style.scss'

import { AppComponent } from './components/app.component'
import { LoginComponent } from './components/login.component'
import { RegistrationComponent } from './components/registration.component'
import { NavbarComponent } from './components/navbar.component'
import { HabitComponent } from './components/habit.component'
import { MainPageComponent } from './components/mainPage.component'
import { NewHabitModal } from './components/newHabit.component'
import { HabitPageComponent } from './components/habitPage.component'
import { CalendarComponent } from './components/calendar.component'
import { InputComponent } from './components/input.component'
import { ChooseHabitModal } from './components/chooseHabit.component'
import { routing } from './router/app.routing'

import { AuthService } from './services/authService'
import { HabitsService } from './services/habits.service'

@NgModule({
  imports:      [BrowserModule, routing, HttpModule, NgbModule.forRoot(), BrowserAnimationsModule],
  declarations: [AppComponent, RegistrationComponent, LoginComponent,
    NavbarComponent, HabitComponent, MainPageComponent, NewHabitModal,
    HabitPageComponent, CalendarComponent, InputComponent, ChooseHabitModal],
  entryComponents: [NewHabitModal, ChooseHabitModal],
  bootstrap:    [AppComponent],
  providers:    [AuthService, HabitsService]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
