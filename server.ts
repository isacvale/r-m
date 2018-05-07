/// <reference path="_all.d.ts" />

'use strict';
const express: any = require('express');
const bodyParser: any = require('body-parser');
const mongoClient: any = require('mongodb').MongoClient;
const cors: any = require('cors');
const port: any = process.env.PORT||3000;
var db: any;

console.log("the code started running");

mongoClient.connect('mongodb://kobayashi:maru@ds012678.mlab.com:12678/dare-db', (err, client) => {
    if (err) return console.log(err);
    db = client.db('dare-db');
    
    app.listen(port, function(){
	console.log('listening on port '+String(port));
});


    
});

console.log("the code milestone 1");

//Create and configure app
const app = express();
//app.options('*', cors());
app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
    
    console.log("the code milestone 2");
});
//app.use(cors());

console.log("the code milestone 3");
//MIDDLEWARE
app.use(bodyParser.urlencoded( {extended: true} ));


//HANDLING EVENTS
app.get('/', (req, res, next) => {
    var cursor = db.collection("company").find().toArray( function(err,results){
            console.log(results);
        console.log("the code milestone 4");
        //res.redirect('http://isacvale.com');
            res.send("It works!");
        });
});

app.get('/company', (req, res, next) => {
    var cursor = db.collection("company").find().toArray( function(err,results){
            //console.log(results);
        console.log("the code milestone 5");
            res.send(results);
        
        });
});

app.post('/company', (req, res) => {
    db.collection('company').save(req.body, (err,result) => {
        if (err) return console.log(err);
        
        console.log('saved to database');
        let goto:string = req.body['webpage']+'/error';
        console.log('redirect: '+goto);
        //res.redirect('http://google.com');
    });
    
   console.log(req.body); 
});


console.log("the code milestone 6");

