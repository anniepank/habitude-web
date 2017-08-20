import {Routes, RouterModule, Router} from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import { LoginComponent }  from '../components/login.component';
import { RegistrationComponent }  from '../components/registration.component';

const appRoutes: Routes = [
  {
    path: 'loginPage',
    component: LoginComponent
  },
  {
    path: 'registrationPage',
    component: RegistrationComponent
  }
]

export const routing:  ModuleWithProviders = RouterModule.forRoot(appRoutes)
