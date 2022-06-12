const myCrypto = require('../../crypto')

describe('Test user & password:', () => {
  test(' ... initialization:', () => {
    const userId = 'testUserId'
    const userPassword = 'testUserPassword'
    const myHash = myCrypto.hashUserAndPassword(userId, userPassword)
    expect(myHash).not.toBeNull() // console.log(myHash, 'length: ' + myHash.length);
    expect(myCrypto.checkUserAndPassword(userId, userPassword, myHash))
  })
})
