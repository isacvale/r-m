/// <reference path="_all.d.ts" />
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
var port = process.env.PORT || 3000;
//const port: any = 3000;
var serverAddress = "https://blooming-hamlet-30182.herokuapp.com/";
var db;
mongoClient.connect('mongodb://kobayashi:maru@ds012678.mlab.com:12678/dare-db', function (err, client) {
    if (err)
        return console.log(err);
    db = client.db('dare-db');
    app.listen(port, function () {
        console.log('listening on port ' + String(port));
    });
});
//Create and configure app
var app = express();
//app.options('*', cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//app.use(cors());
//MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
//HANDLING EVENTS
app.get('/', function (req, res, next) {
    var cursor = db.collection("company").find().toArray(function (err, results) {
        res.send("It works!");
    });
});
//>>>>GETS read from db
app.get('/company', function (req, res, next) {
    var cursor = db.collection("company").find().toArray(function (err, results) {
        res.send(results);
    });
});
app.get('/broker', function (req, res, next) {
    var cursor = db.collection("broker").find().toArray(function (err, results) {
        res.send(results);
    });
});
app.get('/place', function (req, res, next) {
    var cursor = db.collection("place").find().toArray(function (err, results) {
        res.send(results);
    });
});
//>>>>POSTS write to db
app.post('/company', function (req, res) {
    db.collection('company').save(req.body, function (err, result) {
        if (err)
            return console.log(err);
        var goto = req.body['webpage'] + '/error';
        //console.log(">>>>>>>: "+req.body['webpage']);
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/broker', function (req, res) {
    db.collection('broker').save(req.body, function (err, result) {
        if (err)
            return console.log(err);
        var goto = req.body['webpage'] + '/error';
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/place', function (req, res) {
    db.collection('place').save(req.body, function (err, result) {
        if (err)
            return console.log(err);
        var goto = req.body['webpage'] + '/error';
        res.redirect("http://rm.isacvale.com");
    });
});
//>>>>GETS to fetch a specific entry in the db
app.get('/fetch', function (req, res, next) {
    //db.collection("company").findOne( {"$oid": "5aef5d08d92d9831a7b71233" }, function(err,results){
    db.collection(req.query.collection).findOne({ _id: ObjectId(req.query.entryID) }, function (err, results) {
        //console.log(results);
        res.send(results);
    });
});
//>>>>POST to delete
app.post('/delete-company', function (req, res, next) {
    db.collection('company').remove({ "_id": ObjectId(req.body.entryID) }, function (err, results) {
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/delete-broker', function (req, res, next) {
    db.collection('broker').remove({ "_id": ObjectId(req.body.entryID) }, function (err, results) {
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/delete-place', function (req, res, next) {
    db.collection('place').remove({ "_id": ObjectId(req.body.entryID) }, function (err, results) {
        res.redirect("http://rm.isacvale.com");
    });
});
//>>>>POSTS to rewrite db
// app.post('/edit', (req, res) => {
//     let entryID = req.body["_id"];
//     let entryNoun = req.body.noun;
//     if(req.body.noun=="company"){
//       db.collection('company').update( {_id:ObjectId(entryID)}, {
//         name:req.body.name
//       });
//     }
//     else if(req.body.noun=="broker"){
//       db.collection('broker').update( {_id:ObjectId(entryID)}, {
//         name:req.body.name,
//         company:req.body.company
//       });
//     }
//     else if(req.body.noun=="place"){
//       db.collection('place').update( {_id:ObjectId(entryID)}, {
//         address:req.body.address,
//         broker:req.body.broker,
//         rent:req.body.rent
//       });
//     }
//     res.redirect("http://rm.isacvale.com");
//   });
app.post('/edit-company', function (req, res) {
    var entryID = req.body.entryID;
    //db.collection('company').update( {_id:ObjectId(entryID)}, {
    db.collection('company').update({ "_id": ObjectId(req.body.entryID) }, {
        name: req.body.name
    }, function (err, results) {
        if (err)
            return console.log(err);
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/edit-broker', function (req, res) {
    var entryID = req.body.entryID;
    //db.collection('broker').update( {_id:ObjectId(entryID)}, {
    db.collection('broker').update({ "_id": ObjectId(req.body.entryID) }, {
        //db.collection('broker').update( {name:req.body.name}, {
        name: req.body.name,
        company: req.body.company
    });
    res.redirect("http://rm.isacvale.com");
});
app.post('/edit-place', function (req, res) {
    var entryID = req.body.entryID;
    //db.collection('place').update( {_id:ObjectId(entryID)}, {
    db.collection('place').update({ "_id": ObjectId(req.body.entryID) }, {
        address: req.body.address,
        broker: req.body.broker,
        rent: req.body.rent
    });
    res.redirect("http://rm.isacvale.com");
});
