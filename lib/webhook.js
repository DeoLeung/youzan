'use strict';
var md5 = require('md5');

let checkSignature = function (appid, appsecret, msg, sign) {
  return md5(appid + msg + appsecret) === sign;
};

const body_schema = {
  'mode': {
    notEmpty: true,
    isInt: {
      options: [{ 'min': 0, 'max': 1 }],
      errorMessage: 'mode should be 0 or 1, type: number'
    }
  },
  'id': {
    notEmpty: true
  },
  'app_id': {
    notEmpty: true
  },
  'type': {
    notEmpty: true,
    isIn: {
      options: [['TRADE']],
      errorMessage: 'undefined type'
    }
  },
  'msg': {
    notEmpty: true
  },
  'kdt_id': {
    notEmpty: true,
    isInt: {
      errorMessage: 'kdt_id should be integer'
    }
  },
  'sign': {
    notEmpty: true
  },
  'version': {
    notEmpty: true,
    isInt: {
      options: [{'min': 0}],
      errorMessage: 'version should be non-negative long integer'
    }
  },
  'test': {
    notEmpty: true,
    isBoolean: {}
  },
  'sendCount': {
    notEmpty: true,
    isInt: {
      options: [{ 'min': 0 }],
      errorMessage: 'send_count should non-negative integer'
    }
  }
};

var handler = function(kdt, func) {

  return function (req, res) {
    if (req.body && req.body.test) {
      console.log('Received server test message');
      return res.send({ 'code': 0, 'msg': 'success' });
    }

    req.checkBody(body_schema);
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }

    const body = req.body;
    if (!checkSignature(body.app_id, kdt[body.app_id], body.msg, body.sign)) {
      return res.status(403).send();
    }
    res.send({ 'code': 0, 'msg': 'success' });

    delete req.body.sign;
    delete req.body.test;
    req.body.msg = JSON.parse(decodeURI(body.msg));
    func(req);
  };
};

module.exports = handler;