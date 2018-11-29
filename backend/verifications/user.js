module.exports = function User(obj){
    const   login   = obj.loginData,
            info    = obj.userInfo,
            friends = obj.friends;
    if(
    login.login && login.password &&
    info.name && info.lastName && info.nickname && info.birthdate && info.country &&
    friends.outgoingRequest && friends.incomingRequest && friends.friendsList &&
    obj.msg
    ) return true;

    else return false;
}