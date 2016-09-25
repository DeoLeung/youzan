'use strict';
var YOUZAN = require('../index');
var nock = require('nock');
var assert = require('chai').assert;

const replys = {
  '1': {tid: 1},
  '2': {tid: 2},
  '3': {tid: 3},
  '4': {tid: 4}
};

module.exports = () =>
  describe('kdt.trades.sold.get.all tests', () => {
    let YOUZAN_API_URI = 'http://open.koudaitong.com/api/entry';
    let kdt = YOUZAN('testAppID', 'testAppSecret');

    it('single page single trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[replys[1]], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [replys[1]]);
        done();
      });
    });

    it('single page multiple trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[replys[1], replys[2]], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [replys[1], replys[2]]);
        done();
      });
    });

    it('multiple page multiple trade', done => {
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[replys[1], replys[2]], has_next: true}});
      nock(YOUZAN_API_URI)
        .log(console.log)
        .get('')
        .query(true)
        .reply(200, { response: {trades:[replys[3], replys[4]], has_next: false}});
      kdt.trades.sold.get.all({}, (err, trades) => {
        assert.deepEqual(trades, [replys[1], replys[2], replys[3], replys[4]]);
        done();
      });
    });
  });