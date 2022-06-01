const User = require('../../knex/models/User');
const myCrypto = require('../../crypto');
const knex = require('../../knex/knex');
const authUtils = require('../../auth/utils');

var tables = [
    'users',
    'user_roles',
    'users_roles'
];

function truncate() {
    let trancates = [];
    tables.forEach((table) => {
        trancates.push(knex(table).truncate());
    });
    return trancates;
};

describe("Test:", () => {
    beforeAll(() => {
        return Promise.all(truncate()).then(() => {
            console.log(' ...prepare test - trancate tables... ');
        });
    });

    let userId1 = 'testuser12@olc.uz',
        userIdPassword1 = 'testuser1@password',
        roleId1 = "testRole1",
        roleId1Desc = "Some description of role1",
        roleId2 = "testRole2",
        roleId2Desc = "Some description of role2";


    test(" ... user", async () => {
        expect(userId1).toEqual('testuser12@olc.uz');
        let user_1 = await User.query().insert({
            id: userId1,
            hashedPassword: myCrypto.hashUserAndPassword(userId1, userIdPassword1)
        });
        expect(user_1.id).toEqual(userId1);
        expect(myCrypto.checkUserAndPassword(userId1, userIdPassword1, user_1.hashedPassword));

        let user_2 = await User.query().findById(userId1);
        expect(user_2).not.toBeNull();
        expect(myCrypto.checkUserAndPassword(userId1, userIdPassword1, user_2.hashedPassword));
    });

    test(' ... user & roles', async () => {
        let user_1 = await User.query().findById(userId1);
        expect(user_1).not.toBeNull();
        let role_1 = await user_1.$relatedQuery('roles').insert({ id: roleId1, description: roleId1Desc });
        expect(role_1).not.toBeNull();
        expect(role_1.id).toEqual(roleId1);
        let role_2 = await user_1.$relatedQuery('roles').insert({ id: roleId2, description: roleId2Desc });
        expect(role_2).not.toBeNull();
        expect(role_2.id).toEqual(roleId2);
        // get all roles
        let roles = await user_1.$relatedQuery('roles');
        expect(roles).not.toBeNull();
        expect(roles.length).toEqual(2);
    });

    test(' ... admin', async () => {
        const no_admin = await authUtils.isAdminExists();
        expect(no_admin).toBeUndefined();
        const new_admin = await authUtils.setNewAdmin('admin', 'admin');
        expect(new_admin).not.toBeNull();
        expect(myCrypto.checkUserAndPassword('admin', 'admin', new_admin.hashedPassword));
        // let roles = await new_admin.$relatedQuery('roles', 'admin', 'Administrators');
        let role = await authUtils.setRole(new_admin, 'admin', 'Administrators');
        expect(role).not.toBeNull();
        expect(role.id).toEqual('admin');
        let role_2 = await authUtils.setRole(new_admin, 'vip', 'VIP Users');
        expect(role_2).not.toBeNull();
        expect(role_2.id).toEqual('vip');
        let roles = await new_admin.$relatedQuery('roles');
        expect(roles).not.toBeNull();
        expect(roles.length == 2);
    });

    afterAll(() => {
        knex.destroy();
    });

});

