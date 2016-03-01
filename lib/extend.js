'use strict';
var async = require('async');
var util = require('./util');

/**
 * Get all sold trades
 * you can pass in the normal params as kdt.trades.sold.get
 */
let kdtTradesSoldGetAll = function (config, params, callback) {
  // Force using use_has_next
  params.page_size = 100;
  params.use_has_next = true;
  let has_next = true;
  let page_no = 0;
  const trades = new Map();
  let errorCount = 0;
  async.whilst(
    () => {
      page_no++;
      params.page_no = page_no;
      return has_next;},
    youzanCallback => util.get(config, 'kdt.trades.sold.get', params, function (err, ignore, result) {
      if (err) {
        if (errorCount < 3) {
          // retry 3 times if a single request fails
          errorCount++;
          page_no--;
          return youzanCallback();
        } else {
          return youzanCallback(new Error('Fail getting more trading list'));
        }
      }
      errorCount = 0;
      has_next = result.response.has_next;
      result.response.trades.forEach(trade => trades.set(trade.tid, trade));
      youzanCallback();
    }),
    function (err) {
      if (err && trades.size === 0) {
        callback(new Error('Fail getting trading list'));
      } else {
        callback(null, Array.from(trades.values()));
      }
    }
  );
};

module.exports = {
  'kdt.trades.sold.get.all': kdtTradesSoldGetAll
};