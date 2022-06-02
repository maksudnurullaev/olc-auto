const User = require('../knex/models/User');
const Role = require('../knex/models/Role');
const myCrypto = require('../crypto');

function isAdminExists() {
    return User.query().findById('admin');
}
exports.isAdminExists = isAdminExists;

function setNewAdmin(adminId, adminPassword) {
    // async() => {
    const admin = User.query().insert({
        id: adminId,
        hashedPassword: myCrypto.hashUserAndPassword(adminId, adminPassword)
    })
    // let admin_role = await admin.$relatedQuery('roles').insert({id: 'admin', description: 'Administrator'});
    // console.log('New Administrator created!');
    return admin;
    // }
}
exports.setNewAdmin = setNewAdmin

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