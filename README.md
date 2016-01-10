nodejs sdk for www.youzan.com (koudaitong)

This is inspired by [Frank Fan](https://github.com/frankwaizi/youzan)'s work but now it's been revamped

## Important upgrade

It's not compatible with v0.1.4 and below, please update your code where necessary.

## APIs

See [有赞API文档](http://open.koudaitong.com/doc)

## Installation

```sh
$ npm install deo-youzan
```

## Usage
```js
var youzan = require('deo-youzan');


// If you need proxy, set the global request
var request = require('request');
request = request.defaults({proxy: 'your proxy'});

// Get an api object for a certain appid/appsecret
var kdt = youzan(appid, appsecret);

// Normally you can use it as the api 'method' in the API doc
// e.g. method: kdt.trades.sold.get

let params = {
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

let params = {
  // ...
}

let filePaths = [
  // ...
]

kdt.item.add(params, filePaths, function(err, res, body) {
  // ...
});
```
## License

The MIT License
