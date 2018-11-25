module.exports = function User(obj){
    const   login = obj.loginData,
            info  = obj.userInfo;
    if(
    login.login && login.password &&
    info.name   && info.lastName  && info.nickname && info.birthdate && info.country &&
    obj.friends && obj.msg
    ) return true;

    else return false;
}