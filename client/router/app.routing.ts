import {Routes, RouterModule, Router} from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import { LoginComponent }  from '../components/login.component';
import { RegistrationComponent }  from '../components/registration.component';
import { MainPageComponent }  from '../components/mainPage.component';

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
  }
]

export const routing:  ModuleWithProviders = RouterModule.forRoot(appRoutes)
