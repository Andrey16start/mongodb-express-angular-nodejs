import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user = false;

  constructor(private loginService: LoginService, private crudService: CrudService) { }

  ngOnInit() {
    let id = this.loginService.getLogin();

    this.crudService.getOne(id).subscribe(value => {
      console.log(value[0]);
      this.user = value[0];
    })
  }

}
