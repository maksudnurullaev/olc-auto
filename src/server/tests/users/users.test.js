const User = require('../../knex/models/User');
const myCrypto = require('../../crypto');
const knex = require('../../knex/knex');
const authUtils = require('../../auth/utils');
const testUtils = require('../utils')

var tables = [
    'users',
    'roles',
    'users_roles'
];

describe("Test:", () => {
    beforeAll(() => {
        return testUtils.beforeAll(tables);
    });

    test(" ... user: exceptions: create user without ID or Password", () => {
        expect(() => authUtils.addNewUser('admin', '')).toThrow();
        expect(() => authUtils.addNewUser('', 'admin')).toThrow();
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
        const no_admin = await authUtils.isUserExists('admin');
        expect(no_admin).toBeUndefined();
        const new_admin = await authUtils.addNewUser('admin', 'admin');
        expect(new_admin).not.toBeNull();
        expect(myCrypto.checkUserAndPassword('admin', 'admin', new_admin.hashedPassword));

        // add roles #1
        let role_not_exist_yet = await authUtils.getRole(new_admin, 'admin');
        expect(role_not_exist_yet.length).toEqual(0);
        let role_1_added = await authUtils.addRole4User(new_admin.id, 'admin');
        expect(role_1_added).toEqual(1);

        // add roles #2
        let role_2 = await authUtils.addRole('vip', 'VIP User');
        expect(role_2).not.toBeNull();
        expect(role_2.id).toEqual('vip');
        let role_2_added = await authUtils.addRole4User(new_admin, role_2.id);
        expect(role_2_added).toEqual(1);

        // check roles
        let roles = await authUtils.getRoles(new_admin);
        expect(roles.length).toEqual(2);

        // delete role_2 - vip
        let delete_count = await authUtils.delRole4User(new_admin.id, role_2.id);
        expect(delete_count).toEqual(1);
        roles = await authUtils.getRoles(new_admin);
        expect(roles.length).toEqual(1);
        expect(roles[0].id).toEqual('admin')
    });

    afterAll(() => {
        knex.destroy();
    });

});

