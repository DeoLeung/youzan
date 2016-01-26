'use strict';
var objectPath = require('object-path');
var util = require('./lib/util');

let api = {
  get: [
    // 获取商品分类二维列表：<http://open.koudaitong.com/doc/api?method=kdt.itemcategories.get>
    'kdt.itemcategories.get',
    // 获取商品推广栏目列表：<http://open.koudaitong.com/doc/api?method=kdt.itemcategories.promotions.get>
    'kdt.itemcategories.promotions.get',
    // 获取商品自定义标签列表：<http://open.koudaitong.com/doc/api?method=kdt.itemcategories.tags.get>
    'kdt.itemcategories.tags.get',
    // 获取商品自定义标签列表：<http://open.koudaitong.com/doc/api?method=kdt.itemcategories.tags.get>
    'kdt.itemcategories.tags.get',
    // 分页获取商品自定义标签列表：<http://open.koudaitong.com/doc/api?method=kdt.itemcategories.tags.getpage>
    'kdt.itemcategories.tags.getpage',
    // 获取单个商品信息：<http://open.koudaitong.com/doc/api?method=kdt.item.get>
    'kdt.item.get',
    // 根据商品货号获取商品：<http://open.koudaitong.com/doc/api?method=kdt.items.custom.get>
    'kdt.items.custom.get',
    // 获取仓库中的商品列表：<http://open.koudaitong.com/doc/api?method=kdt.items.inventory.get>
    'kdt.items.inventory.get',
    // 获取出售中的商品列表：<http://open.koudaitong.com/doc/api?method=kdt.items.onsale.get>
    'kdt.items.onsale.get',
    // 根据外部编号获取商品SKU：<http://open.koudaitong.com/doc/api?method=kdt.skus.custom.get>
    'kdt.skus.custom.get',
    // 获取单笔交易的信息：<http://open.koudaitong.com/doc/api?method=kdt.trade.get>
    'kdt.trade.get',
    // 查询卖家已卖出的交易列表：<http://open.koudaitong.com/doc/api?method=kdt.trades.sold.get>
    'kdt.trades.sold.get',
    // 根据微信粉丝用户的openid或user_id获取用户信息：<http://open.koudaitong.com/doc/api?method=kdt.users.weixin.follower.get>
    'kdt.users.weixin.follower.get',
    // 根据多个微信粉丝用户的openid或user_id获取用户信息：<http://open.koudaitong.com/doc/api?method=kdt.users.weixin.follower.gets>
    'kdt.users.weixin.follower.gets',
    // 查询微信粉丝用户列表信息：<http://open.koudaitong.com/doc/api?method=kdt.users.weixin.followers.get>
    'kdt.users.weixin.followers.get'
  ],
  postNull: [
    // 删除一个商品：<http://open.koudaitong.com/doc/api?method=kdt.item.delete>
    'kdt.item.delete',
    // 更新SKU信息：<http://open.koudaitong.com/doc/api?method=kdt.item.sku.update>
    'kdt.item.sku.update',
    // 商品下架：<http://open.koudaitong.com/doc/api?method=kdt.item.update.delisting>
    'kdt.item.update.delisting',
    // 商品上架：<http://open.koudaitong.com/doc/api?method=kdt.item.update.listing>
    'kdt.item.update.listing',
    // 卖家确认发货：<http://open.koudaitong.com/doc/api?method=kdt.logistics.online.confirm>
    'kdt.logistics.online.confirm',
    // 卖家标记签收：<http://open.koudaitong.com/doc/api?method=kdt.logistics.online.confirm>
    'kdt.logistics.online.marksign',
    // 物流流转信息查询：<http://open.koudaitong.com/doc/api?method=kdt.logistics.trace.search>
    'kdt.logistics.trace.search',
    // 卖家关闭一笔交易：<http://open.koudaitong.com/doc/api?method=kdt.trade.close>
    'kdt.trade.close',
    // 修改一笔交易备注：<http://open.koudaitong.com/doc/api?method=kdt.trade.memo.update>
    'kdt.trade.memo.update',
    // 根据微信粉丝用户的 openid 或 user_id 绑定对应的标签: <http://open.koudaitong.com/doc/api?method=kdt.users.weixin.follower.tags.add>
    'kdt.users.weixin.follower.tags.add'
  ],
  postImages: [
    // 新增一个商品：<http://open.koudaitong.com/doc/api?method=kdt.item.add>
    'kdt.item.add',
    // 更新单个商品信息：<http://open.koudaitong.com/doc/api?method=kdt.item.update>
    'kdt.item.update'
  ]
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
let kdt = function (
    appid, appsecret, format, version, signMethod, timeout) {
  let config = {
    config: {
      appid: appid,
      appsecret: appsecret,
      format: format || 'json',
      version: version || '1.0',
      signMethod: signMethod || 'md5',
      timeout: timeout || 3000
    },

    // General get/post function to query kdt api directly with complete control
    get: function (method, apiParams, callback) {
      return util.get(config.config, method, apiParams, callback);
    },

    post: function (method, apiParams, filePaths, filekey, callback) {
      return util.post(
        config.config,
        method,
        apiParams,
        filePaths,
        filekey,
        callback);
    }
  };

  // Dynamic helper functions to simplify the call
  api.get.forEach(function (method) {
    objectPath.set(
      config,
      method.replace('kdt.', ''),
      function (apiParams, callback) {
        return util.get(config.config, method, apiParams, callback);
      });
  });

  api.postNull.forEach(function (method) {
    objectPath.set(
      config,
      method.replace('kdt.', ''),
      function (apiParams, callback) {
        return util.post(
          config.config,
          method,
          apiParams,
          null,
          null,
          callback);
      });
  });

  api.postImages.forEach(function (method) {
    objectPath.set(
      config,
      method.replace('kdt.', ''),
      function (apiParams, filePaths, callback) {
        return util.post(
          config.config,
          method,
          apiParams,
          filePaths,
          'images[]',
          callback);
      });
  });
  return config;
};

module.exports = kdt;
