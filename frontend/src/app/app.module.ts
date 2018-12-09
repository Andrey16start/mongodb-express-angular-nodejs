import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './home/menu/menu.component';
import { SearchComponent } from './home/search/search.component';
import { UserComponent } from './home/user/user.component';
import { FriendsComponent } from './home/friends/friends.component';
import { MessagesComponent } from './home/messages/messages.component';

import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from './material.module';

import { CrudService } from './crud.service';
import { LoginService } from './login.service';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    MenuComponent,
    SearchComponent,
    UserComponent,
    FriendsComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    NgxPaginationModule,

    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    CrudService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
