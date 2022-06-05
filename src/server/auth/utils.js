const User = require('../knex/models/User');
const Role = require('../knex/models/Role');
const myCrypto = require('../crypto');

function isUserExists(userId) {
    return User.query().findById(userId);
}
exports.isUserExists = isUserExists

function AuthException(message) {
    this.message = message;
    this.name = "AuthException";
}

function addNewUser(userId, userPassword, phone, description) {
    if (!userId || !userPassword) {
        throw new AuthException("Empty user or password!");
    } else {
        const user = User.query().insert({
            id: userId,
            hashedPassword: myCrypto.hashUserAndPassword(userId, userPassword),
            phone: (phone ? phone : '[no_phone]'),
            description: (description ? description : '[no_description]')
        })
        return user;

    }
}
exports.addNewUser = addNewUser

function getRoles(user) {
    return User.relatedQuery('roles').for(user.id);
}
exports.getRoles = getRoles;

function getRole(user, roleId) {
    return user.$relatedQuery('roles').for(roleId);
}
exports.getRole = getRole;

function addRole(roleId, roleDesc) {
    return Role.query().insert({ id: roleId, description: roleDesc });
}
exports.addRole = addRole;

function delRole4User(userId, roleId) {
    return User.relatedQuery('roles').for(userId).unrelate().where('roleId', roleId);
}
exports.delRole4User = delRole4User;

function addRole4User(userId, roleId) {
    return User.relatedQuery('roles').for(userId).relate(roleId);
}
exports.addRole4User = addRole4User;