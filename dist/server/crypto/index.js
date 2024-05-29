"use strict";

var forge = require('node-forge');
function hashUserAndPassword(userId, userPassword) {
  try {
    var resultInString = userId + userPassword;
    var hashObject = forge.md.sha512.create();
    hashObject.update(resultInString);
    var digest = forge.util.encode64(hashObject.digest().data);
    return digest;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
;
exports.hashUserAndPassword = hashUserAndPassword;
function checkUserAndPassword(userId, userPassword, inHash) {
  var _hash = hashUserAndPassword(userId, userPassword);
  if (!_hash) {
    console.error("Couldn't get proper hashes for user & password!");
    return false;
  }
  // JUST FOR DEBUG
  // console.log('userId', userId);
  // console.log('userPassword', userPassword);
  // console.log('inHash', inHash);
  // console.log('_hash', _hash);
  return _hash.localeCompare(inHash) == 0;
}
exports.checkUserAndPassword = checkUserAndPassword;