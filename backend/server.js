const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const bodyParser = require("body-parser");
const app = express();

const verificationUser = require("./verifications/user");
const verificationLogin = require("./verifications/login");

const url = "mongodb://localhost:27017/";
const port = 8000;

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
})

app.listen(port, () => {
    console.log("Запущен порт - "+port);
});
mongoClient.connect(url, function(err, client){

    if (err) return console.log(err);

    const db = client.db("asn");
    const testCollection = db.collection("test");

    let dbTestAll;
    function dbTestGetAll(){
        testCollection.find({}).toArray(function(err, result){
            dbTestAll = result;
        })
    }
    dbTestGetAll();

    // Все пользователи
    app.get("/users", (req, res) => {
        dbTestGetAll();
        res.status(200).send(dbTestAll);
    });

    // Регистрация
    app.post("/users", (req, res) => {

        if ( verificationUser(req.body) ) {
            // Проверка на уникальность логина и никнейма
            testCollection.find({"loginData.login" : req.body.loginData.login})
            .toArray(function(err, result){
                if (result[0] != undefined){
                    res.status(406).send(); // Логин не прошёл
                    return false;
                } 
                else {
                    testCollection.find({"userInfo.nickname" : req.body.userInfo.nickname})
                    .toArray(function(err, result){
                        if (result[0] != undefined){
                            res.status(409).send() // Никнейм не прошёл
                            return false;
                        }
                        else {
                            testCollection.insertOne(req.body, function(err, res2){
                                if(err) return console.log(err);
                                res.status(201).send(); // Валидация прошла
                                dbTestGetAll();
                            })
                        }
                    })
                }
            })
        }
        if ( !verificationUser(req.body) ) res.status(400);
    })

    // Авторизация
    app.post("/login", (req, res) => {

        if ( verificationLogin(req.body) ){

            testCollection.find({"loginData.login" : req.body.login,
            "loginData.password" : req.body.password}).toArray(function(err, result){
                res.status(200).send(result);
            })
        }
        if ( !verificationLogin(req.body) ) res.status(400);
    })

    // Информация о авторизированном пользователе
    app.get("/login/:id", (req, res) => {

        let o_id = new mongo.ObjectID(req.params.id);
        testCollection.find({"_id" : o_id}).toArray(function(err, result){
            res.status(200).send(result);
        })
    })

    // Информация о другом пользователе по никнейму
    app.get("/user/:nickname", (req, res) => {

        testCollection.find
        ({"userInfo.nickname" : req.params.nickname}).toArray(function(err, result){
            if (result.length == 0) return res.status(400).send();
            let info = {
                userInfo: result[0].userInfo,
                _id : result[0]._id,
                friends: result[0].friends
            }
            info = [info];
            res.status(200).send(info);
        })
    })

    // Запрос в друзья
    app.put("/addToFriends", (req, res) => {
        let o_idFrom = new mongo.ObjectID(req.body.from);
        let o_idTo = new mongo.ObjectID(req.body.to);

        const from = {"_id" : o_idFrom};
        const to = {"_id" : o_idTo};

        testCollection.find(from).toArray(function(err, resultFrom){

            testCollection.find(to).toArray(function(err, resultTo){

                let arrFrom = resultFrom[0].friends.outgoingRequest;
                let arrTo   = resultTo[0].friends.incomingRequest;

                infoFrom = {
                    userInfo: resultTo[0].userInfo,
                    _id: req.body.to
                }
                infoTo = {
                    userInfo: resultFrom[0].userInfo,
                    _id: req.body.from
                }

                arrFrom[resultFrom[0].friends.outgoingRequest.length] = infoFrom;
                arrTo[resultTo[0].friends.incomingRequest.length] = infoTo;
                
                let newValueFrom = { $set: {"friends.outgoingRequest" : arrFrom} };
                let newValueTo = { $set: {"friends.incomingRequest": arrTo} };

                testCollection.updateOne(from, newValueFrom, function(err, res){
                })

                testCollection.updateOne(to, newValueTo, function(err, res){
                })

                res.status(200).send();
            })
        })
    })

})