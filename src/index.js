import  CryptoJS from 'crypto-js';
import  Chance from 'chance';

export const chance = new Chance();

export default CryptoJS;

export function enCodeToken(token) {
   const key = chance.string({ length: 6 });
   const tempToken= CryptoJS.AES.encrypt(token, key).toString();
   const enToken = `${tempToken}${key}`;
   return enToken;
};


export function getToken(enToken) {
  const key = enToken.substr(-6);
  const tempToken = enToken.substr(0, enToken.length - 6);
  const realToken = CryptoJS.AES.decrypt(tempToken, key).toString(CryptoJS.enc.Utf8);
  return realToken;
};