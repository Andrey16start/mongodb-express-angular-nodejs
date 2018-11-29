export class LoginData {
    login: string;
    password: string;
}

export class UserInfo {
    name: string;
    lastName: string;
    nickname: string;
    birthdate: string;
    country: string;
    // id: number;
}

export class Msg{
    author: UserInfo;
    text: string;
    date: string;
}

export class Friends{
    friendsList: UserInfo[];
    outgoingRequest: UserInfo[];
    incomingRequest: UserInfo[];
}

export class User {
    loginData: LoginData;
    userInfo: UserInfo;
    friends: Friends;
    msg: Msg[];
}