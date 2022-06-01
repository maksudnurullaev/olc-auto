const User = require('../knex/models/User');
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

function setRole(user, roleId, roleDesc) {
    return user.$relatedQuery('roles').insert({ id: roleId, description: roleDesc });
}
exports.setRole = setRole;