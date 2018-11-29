import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../models/user';
import { CrudService } from '../crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  countries = ["Україна", "Россия", "United States"];
  regForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private crudService: CrudService,
  private snackBar: MatSnackBar, private router: Router,
  private loginService: LoginService) { }

  ngOnInit() {
    if(this.loginService.getLogin()) this.router.navigate(["/home"]);
    this.initForm();
  }

  isControlInvalid(controlName: string, controlValidator: string): boolean {
    const control = this.regForm.controls[controlName];
    return control.hasError(controlValidator);
  }

  initForm() {
    const fullNameValidator = Validators.pattern("[A-Z,a-z,а-я,А-Я]{1,}");
    const nicknameValidator = Validators.pattern("[A-Z,a-z,а-я,А-Я,0-9]{1,}");
    const loginValidator = Validators.pattern("[A-Z,a-z,а-я,А-Я,0-9,_,@,.,-]{1,}");

    this.regForm = this.fb.group({
      name: ["", [Validators.required, fullNameValidator], ],
      lastName: ["", [Validators.required, fullNameValidator] ],
      nickname: ["", [Validators.required, nicknameValidator] ],
      birthdate: ["", [Validators.required] ],
      login: ["", [Validators.required, loginValidator] ],
      password: ["", [Validators.required] ],
      confirmPassword: ["", [Validators.required] ],
      country: ["", [Validators.required] ]
    });
  }

  submit(){
    let obj = new User;
    let form = this.regForm.value;
    let date = this.regForm.value.birthdate.toJSON() + "";
    date = date.split("T")[0];

    if(form.password != form.confirmPassword) 
      return this.snackBar.open("Пароли не совпадают!", "Ошибка!", {
        duration: 4000,
      });

    obj = {
      loginData: {
        login: form.login,
        password: form.password
      },
      userInfo: {
        name: form.name,
        lastName: form.lastName,
        nickname: form.nickname,
        birthdate: date,
        country: form.country
      },
      friends: {
        friendsList: [],
        outgoingRequest: [],
        incomingRequest: []
      },
      msg: []
    }

    this.crudService.registration(obj).subscribe(value => {
      alert("Вы успешно зарегистрировались!");
      this.router.navigate(["/"]);
    },
    err => {
      console.log("Ошибка - ниже");
      console.log(err)

      if(err.status == 406) 
        return this.snackBar.open("Такой логин уже существует!", "Ошибка!", {
          duration: 4000,
        });

      if(err.status == 409)
        return this.snackBar.open("Такой никнейм уже существует!", "Ошибка!", {
          duration: 4000,
        });

    })

  }

}