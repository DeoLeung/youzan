'use strict';
var YOUZAN = require('../index');
var nock = require('nock');
var assert = require('chai').assert;

module.exports = () =>
  describe('kdt.trades.sold.get.all tests', () => {
    let YOUZAN_API_URI = 'http://open.koudaitong.com/api/entry';
    let kdt = YOUZAN('testAppID', 'testAppSecret');

    it('single page single trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[1], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [1]);
        done();
      });
    });

    it('single page multiple trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[1, 2], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [1, 2]);
        done();
      });
    });

    it('multiple page multiple trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[1, 2], has_next: true}});
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[3, 4], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [1, 2, 3, 4]);
        done();
      });
    });
  });