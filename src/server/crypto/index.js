const forge = require('node-forge')
const utils = require('../../utils/common')
const isDevMode = utils.isDevMode()

function hashUserAndPassword(userId, userPassword) {
  try {
    const resultInString = userId + userPassword
    const hashObject = forge.md.sha512.create()
    hashObject.update(resultInString)
    const digest = forge.util.encode64(hashObject.digest().data)
    return digest
  } catch (error) {
    console.error(error.message)
    return null
  }
};
exports.hashUserAndPassword = hashUserAndPassword

function checkUserAndPassword(userId, userPassword, inHash) {
  const _hash = hashUserAndPassword(userId, userPassword)
  if (!_hash) {
    console.error("Couldn't get proper hashes for user & password!")
    return false
  }

  isDevMode && console.log('userId', userId);
  isDevMode && console.log('userPassword', userPassword);
  isDevMode && console.log('inHash', inHash);
  isDevMode && console.log('_hash', _hash);
  return _hash.localeCompare(inHash) == 0
}
exports.checkUserAndPassword = checkUserAndPassword

function MD5FromString2HexString(inString) {
  var md = forge.md.md5.create();
  md.update(inString);
  return(md.digest().toHex());
}
exports.MD5FromString2HexString = MD5FromString2HexString;