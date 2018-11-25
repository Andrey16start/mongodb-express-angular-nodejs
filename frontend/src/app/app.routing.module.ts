import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './home/search/search.component';
import { UserComponent } from './home/user/user.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "home", component: HomeComponent},
  {path: "search", component: SearchComponent},
  {path: "user/:nickname", component: UserComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
