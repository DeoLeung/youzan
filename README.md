![npm download](https://img.shields.io/npm/dt/deo-youzan.svg)
![npm version](https://img.shields.io/npm/v/deo-youzan.svg)

nodejs sdk(pull/push) for www.youzan.com (koudaitong)

This is inspired by [Frank Fan](https://github.com/frankwaizi/youzan)'s work but now it's been revamped

## Important upgrade

It's not compatible with v0.1.4 and below, please update your code where necessary.

## APIs & Webhook

See [Youzan API Doc](http://open.koudaitong.com/doc) for pulling API

See [Push数据推送服务](https://bbs.youzan.com/forum.php?mod=viewthread&tid=479159) for push notification

## Installation

```sh
$ npm install deo-youzan
```

## General Usage
----
### **Pull:**
```js
var youzan = require('deo-youzan');


// If you need proxy, set the global request
var request = require('request');
request = request.defaults({proxy: 'your proxy'});

// Get an api object for a certain appid/appsecret
var kdt = youzan(appid, appsecret);

// Normally you can use it as the api 'method' in the API doc
// e.g. method: kdt.trades.sold.get

const params = {
  fields: 'tid,pay_time,created,trade_memo,receiver_mobile,orders',
  status: 'WAIT_SELLER_SEND_GOODS'
}

kdt.trades.sold.get(params, function (error, response, body) {
  // error: if any error happens or we detect it's an error response
  // response: if you want to do your own logic with the response
  // body: the json format of the response's body
});

// Some may need extra files path parameter
// e.g. method: kdt.item.add

const params = {
  // ...
}

const filePaths = [
  // ...
]

kdt.item.add(params, filePaths, function(err, res, body) {
  // ...
});
```

### **Extend Usage:**

Except the all the API in the official document, we provide some extend functions to ease the usage:

***kdt.trades.sold.get.all***: This will grab all the trades matching the given param and return them as an Array. Since it contains multiple http requests, we default it to retry 3 times when failure encounted.
____

### **Push:**

For testing purpose, bring up a service and config you 推送网址 as http://yourip:3000 , recommend to try [ngrok](https://ngrok.com/) if you're testing on your own machine:
```sh
node app.js 'your appid' 'your appsecrect' 3000
```

for use, you need to install express:
```
npm install express body-parser express-validator --save
```
then plug in the handler, can have a look at [app.js](app.js)

```js
/*
The webhook handles notification in the following order:
  1. if a test message, response 200 and terminate
  2. validate the request body, if malformed, response 400 and terminate
  3. validate the signature, if not valid, response 403 and terminate
  4. remove sign, test, parse msg of the request body and parse the req object to user provided function for your own logic
*/
'use strict';
var express = require('express');
var app = express();
var handler = require('deo-youzan/lib/webhook');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');


// we need a appid/appsecrect mapping
let kdt = {
  'your appid1': 'your appsecrect1',
  'your appid2': 'your appsecrect2',
};

// youzan sends notification with application/json
app.use(bodyParser.json());
// we need this to validate the message format
app.use(expressValidator([]));

app.post('/', handler(kdt, function(req) {
  console.log(req.body);
  // TODO: process the request here, feel free to replace this function to match your logic
}));

```

## License
____

![license](https://img.shields.io/npm/l/deo-youzan.svg)
