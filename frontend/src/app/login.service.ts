import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoginService{

    getLogin(){
        return sessionStorage.getItem("id");
    }

    saveLogin(id: string){
        sessionStorage.setItem("id", id);
    }

    clearLogin(){
        sessionStorage.removeItem("id");
    }

    check(){
        if (this.getLogin()) return true;
        else return false;
    }

    private isLogin = new BehaviorSubject(this.check());

    getLoginState(): Observable<boolean> {
        return this.isLogin;
    };

    setLoginState(state): void {
        this.isLogin.next(state);
    };

}