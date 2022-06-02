const forge = require('node-forge');

function hashUserAndPassword(userId, password){
    try{
        let resultInString = userId + password;
        let hashObject = forge.md.sha512.create();
        hashObject.update(resultInString);
        let digest = forge.util.encode64(hashObject.digest().data);
        return digest;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};
exports.hashUserAndPassword = hashUserAndPassword;

function checkUserAndPassword(userId, password, inHash){
    let _hash = hashUserAndPassword(userId, password);
    if (!_hash){
        console.error("Couldn't get proper hashes for user & password!");
        return false;
    }   
    return _hash.localeCompare(inHash) == 0;
}
exports.checkUserAndPassword = checkUserAndPassword;
