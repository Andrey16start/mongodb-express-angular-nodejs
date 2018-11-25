import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/crud.service';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = false;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private crudService: CrudService,
  private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {

      this.crudService.getUser(params["nickname"]).subscribe(value => {
        if(value[0]._id == this.loginService.getLogin()){
          return this.router.navigate(["/home"]);
        }
        this.user = value[0];
      })
      
    })
  }

}
