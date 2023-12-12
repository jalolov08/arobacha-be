const CryptoJS = require("crypto-js");

function encryptData(data, key) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}
module.exports = {
  encryptData,
};
