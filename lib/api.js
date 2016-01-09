'use strict';
var request = require('request');
var _ = require('lodash');
var moment = require('moment');
var crypto = require('crypto');
var util = require('./util');
var fs = require('fs');
var utf8 = require('utf8');
var wrapper = util.wrapper;

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
  params['sign'] = sign(config.params);
  return params;
};

let get = function (config, method, apiParams, callback) {
  let opts = {
    url: YOUZAN_PREFIX,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    timeout: config.timeout,
    qs: buildQueryString(config, method, apiParams)
  };

  request(opts, wrapper(callback));
};

let post = function (config, method, apiParams, filePaths, filekey, callback) {
  let opts = {
    url: YOUZAN_PREFIX,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    timeout: config.timeout,
    qs: buildQueryString(config, method, apiParams)
  };

  if (filePaths && filePaths.length > 0 && filekey) {
    let formData = { filekey: [] };

    filePaths.forEach(function (file_path) {
      formData[filekey].push(fs.createReadStream(file_path));
    });
    opts.formData = formData;
  }

  request(opts, wrapper(callback));
};

/**
 * 根据appid和appsecret创建API的构造函数
 * @param {String} proxy       公司内网需要设置代理
 * @param {String} appid       在有赞申请得到的appid
 * @param {String} appsecret   在有赞申请得到的appsecret
 * @param {String} format      （可选）指定响应格式。默认json,目前支持格式为json
 * @param {String} version     （可选）API协议版本，可选值:1.0，默认1.0
 * @param {String} signMethod  （可选）参数的加密方法选择。默认为md5，可选值是：md5
 * @param {int} timeout        （可选）请求有效时间, 单位毫秒。默认为3000
 */
let API = function (
    proxy, appid, appsecret, format, version, signMethod, timeout) {
  this.config = {
    appid: appid,
    appsecret: appsecret,
    format: format || 'json',
    version: version || '1.0',
    signMethod: signMethod || 'md5',
    timeout: timeout || 3000
  }

  this.get = function(method, apiParams, callback) {
    return get(this.config, method, apiParams, callback);
  }

  this.post = function(method, apiParams, filePaths, filekey, callback) {
    return post(this.config, method, apiParams, filePaths, filekey, callback);
  }
};

module.exports = API;
