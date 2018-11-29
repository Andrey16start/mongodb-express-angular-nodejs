import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginData } from '../models/user';
import { CrudService } from '../crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private loginService: LoginService, private router: Router,
  private fb: FormBuilder, private crudService: CrudService,
  private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.loginService.getLogin()) this.router.navigate(["/home"]);

    this.initForm();
  }

  login(id: string){
    this.loginService.saveLogin(id);
    this.loginService.setLoginState(true);
    this.router.navigate(["/home"]);
  }

  isControlInvalid(controlName: string, controlValidator: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.hasError(controlValidator);
  }

  initForm() {
    const loginValidator = Validators.pattern("[A-Z,a-z,а-я,А-Я,0-9,_,@,.,-]{1,}");

    this.loginForm = this.fb.group({
      login: ["", [Validators.required, loginValidator] ],
      password: ["", [Validators.required, loginValidator] ]
    });
  }

  submit(){
    let obj = new LoginData;
    let form = this.loginForm.value;
    obj = {
      login: form.login,
      password: form.password
    }

    this.crudService.login(obj).subscribe(value => {
      if (!value[0])
      return this.snackBar.open("Неверный логин или пароль!", "Ошибка!", {
        duration: 4000,
      });

      else this.login(value[0]._id);

    }, err => {
      console.log(err);
      console.log(`Статус - ${err.status}`);
    })
  }

}
