import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { CrudService } from 'src/app/crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  user;
  init = false;
  incoming = true;
  outgoing = false;

  constructor(private loginService: LoginService, private crudService: CrudService,
  private snackBar: MatSnackBar) { }

  ngOnInit() {
    let id = this.loginService.getLogin();

    this.crudService.getOne(id).subscribe(value => {
      this.user = value[0];
      console.log(value[0]);
      this.init = true;
    })
  }

  selectIncoming(){
    this.incoming = true; this.outgoing = false;
  }

  selectOutgoing(){
    this.outgoing = true; this.incoming = false;
  }

  confirmFriend(id){
    let from = id;
    let to = this.loginService.getLogin();

    this.crudService.confirmFriend(from, to).subscribe(value => {
      let indexIncoming, info;

      this.user.friends.incomingRequest.find(function(elem, index){
        if (elem._id == id)
          indexIncoming = index,
          info = elem;
      })

      this.user.friends.incomingRequest.splice(indexIncoming, 1);
      this.user.friends.friendsList.push(info);

      this.snackBar.open("Запрос в друзья принят!", "", {
        duration: 4000,
      });
    }, err => {
      console.log(err);
    })
  }

  refuseRequest(id){
    let from = id;
    let to = this.loginService.getLogin();

    this.crudService.removeRequestToFrineds(from, to).subscribe(value => {
      let indexIncoming;

      this.user.friends.incomingRequest.find(function(elem, index){
        if (elem._id == id)
          indexIncoming = index;
      })

      this.user.friends.incomingRequest.splice(indexIncoming, 1);

      this.snackBar.open("Запрос в друзья отклонён!", "", {
        duration: 4000,
      });
    }, err => {
      console.log(err);
    })
  }

  removeRequestToFrineds(id){
    let from = this.loginService.getLogin();
    let to = this.user._id;

    this.crudService.removeRequestToFrineds(from, to).subscribe(value => {
      let indexOutgoing;

      this.user.friends.outgoingRequest.find(function(elem, index){
        if (elem._id == id)
          indexOutgoing = index;
      })
      this.user.friends.outgoingRequest.splice(indexOutgoing, 1);

      this.snackBar.open("Запрос в друзья отменён!", "", {
        duration: 4000
      });
    }, err => {
      console.log(err);
    })
  }

}
