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

      this.snackBar.open("Заявка в друзья принята!", "", {
        duration: 4000,
      });
    }, err => {
      console.log(err);
    })
  }

}
