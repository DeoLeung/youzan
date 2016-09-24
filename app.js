'use strict';
var express = require('express');
var app = express();
var handler = require('./lib/webhook');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

const appid = process.argv[2];
const appsecret = process.argv[3];
const port = parseInt(process.argv[4]) || 3000;
let kdt = {};
kdt[appid] = appsecret;

app.use(bodyParser.json());
app.use(expressValidator([]));

app.post('/', handler(kdt, function(req) {
  console.log(req.body);
  // TODO: process the request here
}));

app.listen(port);
console.log(`Started hook for ${appid} on port ${port}`);