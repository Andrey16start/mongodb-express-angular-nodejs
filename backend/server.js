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
        console.log(req.body);
        if ( verificationUser(req.body) ) {
            res.status(201).send({Message: "Валидация прошла успешно, пользователь зарегистрирован"});
            testCollection.insertOne(req.body, function(err, res){
                if(err) console.log(err);
            });
            dbTestGetAll();
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

})