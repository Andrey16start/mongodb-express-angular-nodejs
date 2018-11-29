import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/crud.service';
import { LoginService } from 'src/app/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  init: boolean = false;
  user;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private crudService: CrudService,
  private loginService: LoginService, private router: Router,
  private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {

      this.crudService.getUser(params["nickname"]).subscribe(value => {
        if(value[0]._id == this.loginService.getLogin()){
          return this.router.navigate(["/home"]);
        }
        this.user = value[0];
        this.init = true;
      })
      
    })
  }

  addToFriends(){
    let from = this.loginService.getLogin();
    let to = this.user._id;

    this.crudService.addToFriends(from, to).subscribe(value => {
      return this.snackBar.open("Заявка в друзья отправлена!", "", {
        duration: 4000,
      });
    }, err => {
      console.log(err);
    })
  }

}
