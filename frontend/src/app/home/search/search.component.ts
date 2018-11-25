import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crud.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  users;
  usersFromDB;
  searchInputValue: string;

  constructor(private crudService: CrudService) { }

  ngOnInit() {
    this.crudService.getAll().subscribe(value => {
      this.users = value;
      this.usersFromDB = value;
      console.log(value);
    })
  }

  search(){
    this.users = [];
    let text = this.searchInputValue.toLowerCase();
    let arr = [];
    this.usersFromDB.find(function(elem){
      if(elem.userInfo.name.toLowerCase()     == text ||
         elem.userInfo.lastName.toLowerCase() == text ||
         elem.userInfo.nickname.toLowerCase() == text) arr.push(elem);
    })
    this.users = arr;
    this.searchInputValue = "";
  }

  reset(){
    this.users = this.usersFromDB;
  }

}
