import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User, LoginData } from "./models/user";

@Injectable()
export class CrudService {
  private apiUrl: string = "http://localhost:8000/";

  constructor(private httpClient: HttpClient) { }

  // Регистрация
  public registration(user: User) {
    return this.httpClient.post(`${this.apiUrl}users`, user);
  }

  // Получить всех пользователей
  public getAll(){
    return this.httpClient.get(`${this.apiUrl}users`);
  }

  // Войти в аккаунт, Авторизация
  public login(loginData: LoginData){
    return this.httpClient.post(`${this.apiUrl}login`, loginData);
  }

  // Получить информацию о авторизированом пользователе
  public getOne(id: string){
    return this.httpClient.get(`${this.apiUrl}login/${id}`);
  }

  // Получить информацию о другом пользователе
  public getUser(nickname: string){
    return this.httpClient.get(`${this.apiUrl}user/${nickname}`);
  }

  // Заявка в друзья
  public addToFriends(from: string, to: string){
    const obj = { from: from, to: to };
    return this.httpClient.put(`${this.apiUrl}addToFriends`, obj);
  }

  // Подтверждение заявки в друзья
  public confirmFriend(from: string, to: string){
    const obj = {from: from, to: to};
    return this.httpClient.put(`${this.apiUrl}confirmFriend`, obj);
  }

}