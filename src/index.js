const AES = require("crypto-js/aes");
const utf8 = require("crypto-js/enc-utf8");

export function chance(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default AES;

export function enCodeToken(token) {
   const key = chance(6);
   const key2 = chance(3);

   const tempToken= AES.encrypt(token, key).toString();
   const enToken = `${tempToken}${key}${key2}`;
   return enToken;
};


export function getToken(enToken) {
  const key = enToken.substr(-9, 6);
  const tempToken = enToken.substr(0, enToken.length - 9);
  const realToken = AES.decrypt(tempToken, key).toString(utf8);
  return realToken;
};