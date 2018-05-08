/// <reference path="_all.d.ts" />

'use strict';
const express: any = require('express');
const bodyParser: any = require('body-parser');
const mongoClient: any = require('mongodb').MongoClient;
const cors: any = require('cors');
const port: any = process.env.PORT||3000;
//const port: any = 3000;
const serverAddress:string = "https://blooming-hamlet-30182.herokuapp.com/";
var db: any;

mongoClient.connect('mongodb://kobayashi:maru@ds012678.mlab.com:12678/dare-db', (err, client) => {
    if (err) return console.log(err);
    db = client.db('dare-db');

    app.listen(port, function(){
	console.log('listening on port '+String(port));
    });
});


//Create and configure app
const app = express();
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
app.use(bodyParser.urlencoded( {extended: true} ));

//HANDLING EVENTS
app.get('/', (req, res, next) => {
    var cursor = db.collection("company").find().toArray( function(err,results){
            res.send("It works!");
        });
});

//>>>>GETS read from db
app.get('/company', (req, res, next) => {
    var cursor = db.collection("company").find().toArray( function(err,results){
            res.send(results);
        });
});
app.get('/broker', (req, res, next) => {
    var cursor = db.collection("broker").find().toArray( function(err,results){
            res.send(results);
        });
});
app.get('/place', (req, res, next) => {
    var cursor = db.collection("place").find().toArray( function(err,results){
            res.send(results);
        });
});

//>>>>POSTS write to db
app.post('/company', (req, res) => {
    db.collection('company').save(req.body, (err,result) => {
        if (err) return console.log(err);
        let goto:string = req.body['webpage']+'/error';
        console.log(">>>>>>>: "+req.body['webpage']);
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/broker', (req, res) => {
    db.collection('broker').save(req.body, (err,result) => {
        if (err) return console.log(err);
        let goto:string = req.body['webpage']+'/error';
        res.redirect("http://rm.isacvale.com");
    });
});
app.post('/place', (req, res) => {
    db.collection('place').save(req.body, (err,result) => {
        if (err) return console.log(err);
        let goto:string = req.body['webpage']+'/error';
        res.redirect("http://rm.isacvale.com");
    });
});

//>>>>GETS to fetch a specific entry in the db
app.get('/fetch', (req, res, next) => {
        var cursor = db.collection(req.query.collection).findOne({"_id":req.query.entryID}, function(err,results){
        console.log('---vvv');
        console.log(req.query.collection);
        console.log(req.query.entryID);
        res.send(results);
    });
});
