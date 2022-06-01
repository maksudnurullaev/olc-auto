const User = require('../../knex/models/User');
const myCrypto = require('../../crypto');
const knex = require('../../knex/knex');

var tables = [
    'users',
    'user_roles'
];

function truncate() {
    return knex(User.tableName).truncate();
};

describe("Test:", () => {
    beforeAll(function () {
        return truncate().then(() => {
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

    test(' ... user & roles ', async () => {
        let user_1 = await User.query().findById(userId1);
        expect(user_1).not.toBeNull();
        let role_1 = await user_1.$relatedQuery('roles').insert({id: roleId1, description: roleId1Desc});
        expect(role_1).not.toBeNull();
        expect(role_1.id).toEqual(roleId1);        
        let role_2 = await user_1.$relatedQuery('roles').insert({id: roleId2, description: roleId2Desc});
        expect(role_2).not.toBeNull();
        expect(role_2.id).toEqual(roleId2);        

        let roles = await user_1.$relatedQuery('roles');
        expect(roles).not.toBeNull();
        expect(roles.length == 2);
    });


    afterAll(() => {
        knex.destroy();
    });

});

