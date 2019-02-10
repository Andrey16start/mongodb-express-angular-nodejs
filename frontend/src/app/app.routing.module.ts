import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './home/search/search.component';
import { UserComponent } from './home/user/user.component';
import { FriendsComponent } from './home/friends/friends.component';
import { MessagesComponent } from './home/messages/messages.component';
import { Error404Component } from './errors/error404/error404.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "home", component: HomeComponent},
  {path: "search", component: SearchComponent},
  {path: "user/:nickname", component: UserComponent},
  {path: "friends", component: FriendsComponent},
  {path: "messages", component: MessagesComponent},
  {path: "error404", component: Error404Component}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(["/error404"]);
    }
  }
}