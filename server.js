'use strict';
var express = require('express');
var app = express();
var handler = require('./lib/webhook');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(expressValidator([]));

module.exports = (kdt) => {
  app.post('/', handler(kdt, req => {
    console.log(req.body);
    // TODO: process the request here
  }));
  return app;
};