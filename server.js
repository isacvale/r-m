/// <reference path="_all.d.ts" />
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
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
        console.log(">>>>>>>: " + req.body['webpage']);
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
    db.collection("company").findOne({ "$oid": "5aef5d08d92d9831a7b71233" }, function (err, results) {
        res.send(results);
    });
});
