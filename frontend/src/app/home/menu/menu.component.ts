import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    if (!this.loginService.getLogin()) this.router.navigate(["/"]);
  }

  exit(){
    this.loginService.clearLogin();
    this.loginService.setLoginState(false);
    this.router.navigate(["/"])
  }

}
