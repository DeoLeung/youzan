'use strict';
var request = require('request');
var _ = require('lodash');
var moment = require('moment');
var crypto = require('crypto');
var util = require('./util');
var fs = require('fs');
var utf8 = require('utf8');
var wrapper = util.wrapper;

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
var API = function (
    proxy, appid, appsecret, format, version, signMethod, timeout) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.format = format || 'json';
  this.version = version || '1.0';
  this.signMethod = signMethod || 'md5';
  this.timeout = timeout || 3000;

  if (proxy) {
    request = request.defaults({ proxy: proxy });
  }

  this.prefix = 'http://open.koudaitong.com/api/entry';
};


API.prototype.doGet = function (method, apiParams, callback) {
  let opts = {
    url: this.prefix,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    timeout: this.timeout,
    qs: this.buildQueryString(method, apiParams)
  };

  request(opts, wrapper(callback));
};


API.prototype.doPost = function (method, apiParams, filePaths, filekey, callback) {
  let opts = {
    url: this.prefix,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    timeout: this.timeout,
    qs: this.buildQueryString(method, apiParams)
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

API.prototype.buildQueryString = function (method, apiParams) {
  let params = {
    'app_id': this.appid,
    'method': method,
    'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
    'format': this.format,
    'v': this.version,
    'sign_method': this.signMethod
  };
  Object.keys(apiParams).forEach(function (key) {
    params[key] = apiParams[key];
  });
  params['sign'] = this.sign(params);
  return params;
};


API.prototype.sign = function (params) {
  let str = this.appsecret;
  Object.keys(params).sort().forEach(function (key) {
    str += key;
    str += params[key];
  });
  str += this.appsecret;
  return crypto
    .createHash(this.signMethod)
    .update(str, 'utf8')
    .digest('hex')
    .toLowerCase();
};

module.exports = API;
