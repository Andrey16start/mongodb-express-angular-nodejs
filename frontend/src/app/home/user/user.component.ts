import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/crud.service';
import { LoginService } from 'src/app/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend } from 'src/app/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  init: boolean = false;
  user;
  subscription: Subscription;
  justUser: boolean = true;
  friend: boolean = false;
  outgoing: boolean = false;
  incoming: boolean = false;
  msgPopup: boolean = false;
  msgText: string = "";

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

        let login = this.loginService.getLogin();
        let friend = this.friend;
        let outgoing = this.outgoing;
        let justUser = this.justUser;
        let incoming = this.incoming;

        this.user.friends.friendsList.find(function(elem){
          if (elem._id == login)
            friend = true, justUser = false;
        })
        
        this.user.friends.incomingRequest.find(function(elem){
          if (elem._id == login)
            outgoing = true, justUser = false;
        })

        this.user.friends.outgoingRequest.find(function(elem){
          if(elem._id == login)
            incoming = true, justUser = false;
        })

        this.justUser = justUser;
        this.friend = friend;
        this.outgoing = outgoing;
        this.incoming = incoming;

        this.init = true;
      })
      
    })
  }

  addToFriends(){
    let from = this.loginService.getLogin();
    let to = this.user._id;

    this.crudService.addToFriends(from, to).subscribe(value => {
      this.outgoing = true;
      this.justUser = false;

      this.snackBar.open("Запрос в друзья отправлен!", "", {
        duration: 4000
      });
    }, err => {
      console.log(err);
    })
  }

  confirmFriend(){
    let from = this.user._id;
    let to = this.loginService.getLogin();

    this.crudService.confirmFriend(from, to).subscribe(value => {
      this.crudService.getOne(to).subscribe(value => {
        let friend: Friend = {
          _id: to,
          userInfo: value[0].userInfo
        }
        this.user.friends.friendsList.push(friend);
        
        this.snackBar.open("Запрос в друзья принят!", "", {
          duration: 4000
        });

        this.incoming = false;
        this.friend = true;
      })
    }, err => {
      console.log(err);
    })
  }

  removeRequestToFrineds(){
    let from = this.loginService.getLogin();
    let to = this.user._id;

    this.crudService.removeRequestToFrineds(from, to).subscribe(value => {
      this.snackBar.open("Запрос в друзья отменен!", "", {
        duration: 4000
      });
      this.outgoing = false;
      this.justUser = true;
    }, err => {
      console.log(err);
    })
  }

  deleteFromFriends(){
    let from = this.user._id;
    let to = this.loginService.getLogin();
    let i: number;

    this.crudService.deleteFromFriends(from, to).subscribe(value => {
      this.user.friends.friendsList.find(function(elem, index){
        if (elem._id == to)
          i = index;
      })
      this.user.friends.friendsList.splice(i, 1);

      this.snackBar.open("Пользователь удалён из друзей!", "", {
        duration: 4000
      });
      this.friend = false;
      this.justUser = true;
    })
  }

  sendMessage(){
    let from = this.loginService.getLogin();
    let to = this.user._id;
    
    this.crudService.sendMsg(from, to, this.msgText).subscribe(value => {
      this.msgText = "";
      this.msgPopup = false;
      this.snackBar.open("Сообщение отправлено!", "", {
        duration: 4000
      })
    }, err => console.log(err));
  }

}
