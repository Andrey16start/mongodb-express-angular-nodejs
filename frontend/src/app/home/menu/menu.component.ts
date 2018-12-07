import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/crud.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  incomingRequests;

  constructor(private loginService: LoginService, private router: Router,
    private crudService: CrudService) { }

  ngOnInit() {
    if (!this.loginService.getLogin()) this.router.navigate(["/"]);
    else {
      let id = this.loginService.getLogin();

      this.crudService.getOne(id).subscribe(value => {
        this.incomingRequests = value[0].friends.incomingRequest;
      }, err => {
        console.log(err);
      })
    }
  }

  exit() {
    this.loginService.clearLogin();
    this.loginService.setLoginState(false);
    this.router.navigate(["/"])
  }

}
