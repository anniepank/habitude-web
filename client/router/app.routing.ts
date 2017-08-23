import {Routes, RouterModule, Router} from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import { LoginComponent }  from '../components/login.component';
import { RegistrationComponent }  from '../components/registration.component';
import { MainPageComponent }  from '../components/mainPage.component';
import { HabitPageComponent } from '../components/habitPage.component'


const appRoutes: Routes = [
  {
    path: 'loginPage',
    component: LoginComponent
  },
  {
    path: 'registrationPage',
    component: RegistrationComponent
  },
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'habit/:id',
    component: HabitPageComponent
  }
]

export const routing:  ModuleWithProviders = RouterModule.forRoot(appRoutes)
