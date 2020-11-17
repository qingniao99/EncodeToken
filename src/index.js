const Chance = require('chance');
const AES = require("crypto-js/aes");
const utf8 = require("crypto-js/enc-utf8");

export const chance = new Chance();

export default AES;

export function enCodeToken(token) {
   const key = chance.string({ length: 6 });
   const key2 = chance.string({ length: 3 });

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