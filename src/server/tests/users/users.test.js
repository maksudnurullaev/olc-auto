const User = require('../../knex/models/User');
const myCrypto = require('../../crypto');
const knex = require('../../knex/knex');

var tables = [
    'users',
    'user_roles'
];

function truncate() {
    // return Promise.all(tables, function (table) {
    //     return knex.raw('truncate table ' + table + ' cascade');
    // });
    return knex(User.tableName).truncate();
};

describe("Test with users:", () => {
    beforeEach(function () {
        return truncate().then(() => {
            console.log(' ...trancate all... ');
        });
    });

    test(" ... create", () => {
        // truncate().then(() => {
            let id1 = 'testuser12@olc.uz';
            let password1 = 'testuser1@password';
            expect(id1).toEqual('testuser12@olc.uz');
            // User.query().delete().then((ttt) => {
            User.query().insert({
                id: id1,
                hashedPassword: myCrypto.hashUserAndPassword(id1, password1)
            }).then((testUser1) => {
                // console.log(testUser1);
                expect(testUser1.id).toEqual(id1);
                expect(myCrypto.checkUserAndPassword(id1, password1, testUser1.hashedPassword));
                User.query().delete().where('users.is', testUser1.id).then((user) => {
                    console.log("Delete test user: " + testUser1.id);
                });
            });
        // });
        // });
    });

    // beforeEach(() => {
    //     // User.query().delete();
    // });

    afterAll(() => {
        console.log("...after all...")
        knex.destroy();
        // setTimeout(() => {
            // knex.destroy();
        // }, 500);
        // process.exit();
    });

});

