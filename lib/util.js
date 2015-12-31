'use strict';
/*!
 * 对返回结果的一层封装，如果遇见有赞返回的错误，将返回一个错误
 * 参见：http://open.koudaitong.com/doc/api/errors
 */
exports.wrapper = function (callback) {
  return function (err, res, data) {
    if(!data){
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
