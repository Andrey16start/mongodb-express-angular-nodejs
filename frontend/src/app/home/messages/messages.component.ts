import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crud.service';
import { LoginService } from 'src/app/login.service';
import { Dialog } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  user;
  init: boolean = false;
  currentDialog = new Dialog;
  msgText: string = "";

  constructor(private crudService: CrudService, private loginService: LoginService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    let id = this.loginService.getLogin();
    this.crudService.getOne(id).subscribe(value => {
      this.user = value[0];
      this.init = true;
    })
  }

  openDialog(dialog) {
    this.currentDialog = dialog;
    console.log(this.currentDialog);
  }

  sendMessage() {
    if (this.currentDialog.msg && this.currentDialog.interlocutor) {
      let from = this.loginService.getLogin();
      let to = this.currentDialog.interlocutor._id;

      console.log(this.currentDialog);

      this.crudService.sendMsg(from, to, this.msgText).subscribe(value => {

        this.crudService.getOne(this.loginService.getLogin()).subscribe(valueTwo => {
          let i: number;
          valueTwo[0].dialogs.forEach(function (elem, index) {
            if (elem.interlocutor._id == to)
              i = index;
          });
          this.currentDialog.msg = valueTwo[0].dialogs[i].msg;
          this.msgText = "";
          this.snackBar.open("Сообщение отправлено!", "", {
            duration: 2000
          });
        }, err => console.log(err));

      }, err => console.log(err));
    }

    else
      this.snackBar.open("Выберите собеседника!", "Ошибка!", {
        duration: 3000
      });
  }

  msgAuthorCheck(i): boolean {
    if (i > 0){
      let msg = this.currentDialog.msg;
      if (msg[i].author == msg[i-1].author)
        return false;
      else return true;
    }
    else return true;
  }

  msgDateCheck(i): boolean {
    if (i > 0){
      let msg = this.currentDialog.msg;
      if (msg[i].date == msg[i-1].date)
        return false;
      else return true;
    }
    else return true;
  }

}
