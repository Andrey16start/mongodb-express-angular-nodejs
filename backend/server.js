const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const bodyParser = require("body-parser");
const app = express();

const verificationUser = require("./verifications/user");
const verificationLogin = require("./verifications/login");

const url = "mongodb://localhost:27017/";
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
})

app.listen(port, () => {
    console.log("Запущен порт - " + port);
});

mongoClient.connect(url, function (err, client) {

    if (err) return console.log(err);

    const db = client.db("asn");
    const testCollection = db.collection("test");

    let dbTestAll;
    function dbTestGetAll() {
        testCollection.find({}).toArray(function (err, result) {
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
        if (verificationUser(req.body)) {
            // Проверка на уникальность логина и никнейма
            testCollection.find({ "loginData.login": req.body.loginData.login })
                .toArray(function (err, result) {
                    if (result[0] != undefined) {
                        res.status(406).send(); // Логин не прошёл
                        return false;
                    }
                    else {
                        testCollection.find({ "userInfo.nickname": req.body.userInfo.nickname })
                            .toArray(function (err, result) {
                                if (result[0] != undefined) {
                                    res.status(409).send() // Никнейм не прошёл
                                    return false;
                                }
                                else {
                                    testCollection.insertOne(req.body, function (err, res2) {
                                        if (err) return console.log(err);
                                        res.status(201).send(); // Валидация прошла
                                        dbTestGetAll();
                                    })
                                }
                            })
                    }
                })
        }
        if (!verificationUser(req.body)) res.status(400);
    })

    // Авторизация
    app.post("/login", (req, res) => {
        if (verificationLogin(req.body)) {

            testCollection.find({
                "loginData.login": req.body.login,
                "loginData.password": req.body.password
            }).toArray(function (err, result) {
                res.status(200).send(result);
            })
        }
        if (!verificationLogin(req.body)) res.status(400);
    })

    // Информация о авторизированном пользователе
    app.get("/login/:id", (req, res) => {
        let o_id = new mongo.ObjectID(req.params.id);
        testCollection.find({ "_id": o_id }).toArray(function (err, result) {
            res.status(200).send(result);
        })
    })

    // Информация о другом пользователе по никнейму
    app.get("/user/:nickname", (req, res) => {
        testCollection.find
            ({ "userInfo.nickname": req.params.nickname }).toArray(function (err, result) {
                if (result.length == 0) return res.status(400).send();
                let info = {
                    userInfo: result[0].userInfo,
                    _id: result[0]._id,
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

        const from = { "_id": o_idFrom };
        const to = { "_id": o_idTo };

        testCollection.find(from).toArray(function (err, resultFrom) {

            testCollection.find(to).toArray(function (err, resultTo) {

                let arrFrom = resultFrom[0].friends.outgoingRequest;
                let arrTo = resultTo[0].friends.incomingRequest;

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

                let newValueFrom = { $set: { "friends.outgoingRequest": arrFrom } };
                let newValueTo = { $set: { "friends.incomingRequest": arrTo } };

                testCollection.updateOne(from, newValueFrom, function (err, res) {
                })

                testCollection.updateOne(to, newValueTo, function (err, res) {
                })

                res.status(200).send();
            })
        })
    })

    // Подтверждение запроса в друзья
    app.put("/confirmFriend", (req, res) => {
        let o_idFrom = new mongo.ObjectID(req.body.from);
        let o_idTo = new mongo.ObjectID(req.body.to);

        const from = { "_id": o_idFrom };
        const to = { "_id": o_idTo };

        testCollection.find(from).toArray(function (err, resultFrom) {

            testCollection.find(to).toArray(function (err, resultTo) {

                let requestFrom = resultFrom[0].friends.outgoingRequest;
                let requestTo = resultTo[0].friends.incomingRequest;
                let frinedsFrom = resultFrom[0].friends.friendsList;
                let friendsTo = resultTo[0].friends.friendsList;

                let i = 0;
                requestFrom.find(function (elem, index) {
                    if (elem._id == req.body.to)
                        i = index;
                })
                requestFrom.splice(i, 1);
                i = 0;
                requestTo.find(function (elem, index) {
                    if (elem._id == req.body.from)
                        i = index;
                })
                requestTo.splice(i, 1);

                infoFrom = {
                    userInfo: resultTo[0].userInfo,
                    _id: req.body.to
                }
                infoTo = {
                    userInfo: resultFrom[0].userInfo,
                    _id: req.body.from
                }

                frinedsFrom[frinedsFrom.length] = infoFrom;
                friendsTo[friendsTo.length] = infoTo;

                let newValueFrom = {
                    $set: {
                        "friends.outgoingRequest": requestFrom,
                        "friends.friendsList": frinedsFrom
                    }
                };

                let newValueTo = {
                    $set: {
                        "friends.incomingRequest": requestTo,
                        "friends.friendsList": friendsTo
                    }
                };

                testCollection.updateOne(from, newValueFrom, function (err, res) {
                })
                testCollection.updateOne(to, newValueTo, function (err, res) {
                })

                res.status(200).send();
            })
        })
    })

    // Отменить запрос в друзья || Отказать в запросе в друзья
    app.put("/removeRequestToFriends", (req, res) => {
        let o_idFrom = new mongo.ObjectID(req.body.from);
        let o_idTo = new mongo.ObjectID(req.body.to);
        console.log("Отмена заявки в друзья");
        console.log(req.body);

        const from = { "_id": o_idFrom };
        const to = { "_id": o_idTo };

        testCollection.find(from).toArray(function (err, resultFrom) {

            testCollection.find(to).toArray(function (err, resultTo) {

                let outgoingRequestFrom = resultFrom[0].friends.outgoingRequest;
                let incomingRequestTo = resultTo[0].friends.incomingRequest;

                let i = 0;
                outgoingRequestFrom.find(function (elem, index) {
                    if (elem._id == req.body.to)
                        i = index;
                })
                outgoingRequestFrom.splice(i, 1);

                i = 0;
                incomingRequestTo.find(function (elem, index) {
                    if (elem._id == req.body.from)
                        i = index;
                })
                incomingRequestTo.splice(i, 1);

                let newValueFrom = { $set: { "friends.outgoingRequest": outgoingRequestFrom } };
                let newValueTo = { $set: { "friends.incomingRequest": incomingRequestTo } };

                testCollection.updateOne(from, newValueFrom, function (err, res) {
                })
                testCollection.updateOne(to, newValueTo, function (err, res) {
                })

                res.status(200).send();
            })
        })
    })

    // Удалить из друзей
    app.put("/deleteFromFriends", (req, res) => {
        let o_idFrom = new mongo.ObjectID(req.body.from);
        let o_idTo = new mongo.ObjectID(req.body.to);

        const from = { "_id": o_idFrom };
        const to = { "_id": o_idTo };

        testCollection.find(from).toArray(function (err, resultFrom) {

            testCollection.find(to).toArray(function (err, resultTo) {

                let frinedsFrom = resultFrom[0].friends.friendsList;
                let friendsTo = resultTo[0].friends.friendsList;

                let i = 0;
                frinedsFrom.find(function (elem, index) {
                    if (elem._id == req.body.to)
                        i = index;
                })
                frinedsFrom.splice(i, 1);

                i = 0;
                friendsTo.find(function (elem, index) {
                    if (elem._id == req.body.from)
                        i = index;
                })
                friendsTo.splice(i, 1);

                let newValueFrom = { $set: { "friends.friendsList": frinedsFrom } };

                let newValueTo = { $set: { "friends.friendsList": friendsTo } };

                testCollection.updateOne(from, newValueFrom, function (err, res) {
                })
                testCollection.updateOne(to, newValueTo, function (err, res) {
                })

                res.status(200).send();
            })
        })
    })

    // Отправить сообщение
    app.put("/sendMsg", (req, res) => {
        let o_idFrom = new mongo.ObjectID(req.body.from);
        let o_idTo = new mongo.ObjectID(req.body.to);

        let now = new Date();
        now = now.toJSON() + "";
        let t = now.split("T")[1];

        const from = { "_id": o_idFrom };
        const to = { "_id": o_idTo };
        const text = req.body.text;
        const date = now.split("T")[0];
        let time = "";
        for (let j = 0; j < 5; j++) {
            time += t[j];
        }

        testCollection.find(from).toArray(function (err, resultFrom) {
            testCollection.find(to).toArray(function (err, resultTo) {

                let dialogsFrom = resultFrom[0].dialogs;
                let dialogsTo = resultTo[0].dialogs;
                let heExist = false;

                let iFrom;
                dialogsFrom.find(function (elem, index) {
                    if (elem.interlocutor._id == req.body.to) {
                        heExist = true;
                        iFrom = index;
                    }
                })
                let iTo;
                dialogsTo.find(function (elem, index) {
                    if (elem.interlocutor._id == req.body.from)
                        iTo = index;
                })

                msgFrom = {
                    author: true,
                    text: text,
                    date: date,
                    time: time
                }
                msgTo = {
                    author: false,
                    text: text,
                    date: date,
                    time: time
                }

                if (heExist) {
                    dialogsFrom[iFrom].msg.unshift(msgFrom);
                    dialogsTo[iTo].msg.unshift(msgTo);
                    newValueFrom = { $set: { "dialogs": dialogsFrom } };
                    newValueTo = { $set: { "dialogs": dialogsTo } };

                    testCollection.updateOne(from, newValueFrom, function (err, res) {
                    })
                    testCollection.updateOne(to, newValueTo, function (err, res) {
                    })

                    res.status(200).send();
                }

                else {
                    infoFrom = {
                        interlocutor: {
                            userInfo: resultTo[0].userInfo,
                            _id: req.body.to
                        },
                        msg: [msgFrom]
                    }
                    infoTo = {
                        interlocutor: {
                            userInfo: resultFrom[0].userInfo,
                            _id: req.body.from
                        },
                        msg: [msgTo]
                    }

                    dialogsFrom.push(infoFrom);
                    dialogsTo.push(infoTo);

                    newValueFrom = { $set: { "dialogs": dialogsFrom } };
                    newValueTo = { $set: { "dialogs": dialogsTo } };

                    testCollection.updateOne(from, newValueFrom, function (err, res) {
                    })
                    testCollection.updateOne(to, newValueTo, function (err, res) {
                    })

                    res.status(200).send();
                }

            })
        })
    })

})