const myCrypto = require('../../crypto');

describe("Test user & password:", () => {
    test(" ... initialization:", () => {
        let userId = 'testUserId',
            userPassword = 'testUserPassword';
        let myHash = myCrypto.hashUserAndPassword(userId, userPassword);
        expect(myHash).not.toBeNull();        // console.log(myHash, 'length: ' + myHash.length);
        expect(myCrypto.checkUserAndPassword(userId, userPassword, myHash));
    });
});