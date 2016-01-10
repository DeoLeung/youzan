'use strict';
var request = require('request');
var moment = require('moment');
var crypto = require('crypto');
var fs = require('fs');

/*!
 * 对返回结果的一层封装，如果遇见有赞返回的错误，将返回一个错误
 * 参见：http://open.koudaitong.com/doc/api/errors
 */
let wrapper = function (callback) {
  return function (err, res, data) {
    if (!data) {
      data = {
        error_response: {
          code: 1,
          msg: "no response data"
        }
      };
    } else {
      data = JSON.parse(data);
    }
    callback = callback || function () {};
    if (err) {
      err.name = 'KDTAPI' + err.name;
      console.error(err);
    }
    if (data.error_response) {
      err = new Error(data.error_response);
      err.name = 'KDTAPIError';
      err.code = data.error_response.code;

      console.error(err);
    }
    callback(err, res, data);
  };
};

let YOUZAN_PREFIX = 'http://open.koudaitong.com/api/entry';

let sign = function (config, params) {
  let str = config.appsecret;
  Object.keys(params).sort().forEach(function (key) {
    str += key;
    str += params[key];
  });
  str += config.appsecret;
  return crypto
    .createHash(config.signMethod)
    .update(str, 'utf8')
    .digest('hex')
    .toLowerCase();
};

let buildQueryString = function (config, method, apiParams) {
  let params = {
    'app_id': config.appid,
    'method': method,
    'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
    'format': config.format,
    'v': config.version,
    'sign_method': config.signMethod
  };
  Object.keys(apiParams).forEach(function (key) {
    params[key] = apiParams[key];
  });
  params['sign'] = sign(config, params);
  return params;
};

let get = function (config, method, apiParams, callback) {
  let opts = {
    url: YOUZAN_PREFIX,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    timeout: config.timeout,
    qs: buildQueryString(config, method, apiParams)
  };

  request(opts, wrapper(callback));
};

let post = function (config, method, apiParams, filePaths, filekey, callback) {
  let opts = {
    url: YOUZAN_PREFIX,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    timeout: config.timeout,
    qs: buildQueryString(config, method, apiParams)
  };

  if (filePaths && filePaths.length > 0 && filekey) {
    let formData = {
      filekey: []
    };

    filePaths.forEach(function (file_path) {
      formData[filekey].push(fs.createReadStream(file_path));
    });
    opts.formData = formData;
  }

  request(opts, wrapper(callback));
};

module.exports = {
  get: get,
  post: post
}
