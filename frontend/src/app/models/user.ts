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
}

export class Msg{
    author: boolean; // True-You. False-Your interlocutor
    text: string;
    date: string;
    time: string;
}

export class Dialog{
    interlocutor: Friend;
    msg: Msg[];
}

export class Friend{
    userInfo: UserInfo;
    _id: string;
}

export class Friends{
    friendsList: Friend[];
    outgoingRequest: Friend[];
    incomingRequest: Friend[];
}

export class User {
    loginData: LoginData;
    userInfo: UserInfo;
    friends: Friends;
    dialogs: Dialog[];
    _id?: string;
}