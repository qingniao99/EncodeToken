var Chance = require('chance');

var AES = require("crypto-js/aes");

var chance = new Chance();
function enCodeToken(token) {
  var key = chance.string({
    length: 6
  });
  var key2 = chance.string({
    length: 3
  });
  var tempToken = AES.encrypt(token, key).toString();
  var enToken = "".concat(tempToken).concat(key).concat(key2);
  return enToken;
}
function getToken(enToken) {
  var key = enToken.substr(-9, 6);
  var tempToken = enToken.substr(0, enToken.length - 9);
  var realToken = AES.decrypt(tempToken, key).toString(CryptoJS.enc.Utf8);
  return realToken;
}

export default AES;
export { chance, enCodeToken, getToken };
