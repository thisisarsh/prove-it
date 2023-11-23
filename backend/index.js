var express = require('express');
const cors = require('cors');   //deal with CORS problem when communicating front end and back end
require('dotenv').config();     //for import token from .env file

var app = express();
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const routesHandler = require('./routes/handler.js');

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routesHandler);

app.listen(5000, function () {
    console.log('Node server is running..');
});