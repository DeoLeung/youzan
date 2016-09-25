'use strict';
var assert = require('chai').assert;
var superagent = require('superagent');

const push = require('./push.json');
const push_body = require('./push_body.json');
var app = require('../server');

let server;
const kdt = {'testAppID': 'testAppSecret'};

before(done => {
  server = app(kdt).listen(3000);
  done();
});

after(() => {
  server.close();
});

const clone = function(json) {
  return JSON.parse(JSON.stringify(json));
}

module.exports = () =>
  describe('webhook', () => {
    let WEBHOOK_URI = 'http://localhost:3000';
    const res_ok = {
      'code': 0,
      'msg': 'success'
    };

    it('test message', done => {
      let req = clone(push);
      req.test = true;
      delete req.app_id;
      superagent
        .post(WEBHOOK_URI)
        .send(req)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          assert.deepEqual(res_ok, res.body);
          done();
        });
    });

    it('validate body', done => {
      let req = clone(push);
      delete req.app_id;
      superagent
        .post(WEBHOOK_URI)
        .send(req)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          assert.deepEqual([ { param: 'app_id', msg: 'Invalid param' } ], res.body);
          done();
        });
    });

    it('invalid sign', done => {
      let req = clone(push);
      req.sign = 'wrong md5';
      superagent
        .post(WEBHOOK_URI)
        .send(req)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          assert.equal(403, res.statusCode);
          done();
        });
    });

    it('correct request', done => {
      superagent
        .post(WEBHOOK_URI)
        .send(push)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          assert.deepEqual(res.body, res_ok);
          done();
        });
    });
  });