module.exports = function Login(obj){
    if (obj.login && obj.password) return true;
    else return false;
}