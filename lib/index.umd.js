(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EnToken = {}));
}(this, (function (exports) {
  var AES = require("crypto-js/aes");

  var utf8 = require("crypto-js/enc-utf8");

  function chance(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  function enCodeToken(token) {
    var key = chance(6);
    var key2 = chance(3);
    var tempToken = AES.encrypt(token, key).toString();
    var enToken = "".concat(tempToken).concat(key).concat(key2);
    return enToken;
  }
  function getToken(enToken) {
    var key = enToken.substr(-9, 6);
    var tempToken = enToken.substr(0, enToken.length - 9);
    var realToken = AES.decrypt(tempToken, key).toString(utf8);
    return realToken;
  }

  exports.chance = chance;
  exports.default = AES;
  exports.enCodeToken = enCodeToken;
  exports.getToken = getToken;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
