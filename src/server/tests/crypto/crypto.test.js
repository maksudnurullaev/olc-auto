const myCrypto = require('../../crypto')
const utils = require('../../../utils/utils.js')

describe('Test user & password:', () => {
  test(' ... initialization:', () => {
    const userId = 'testUserId'
    const userPassword = 'testUserPassword'
    const myHash = myCrypto.hashUserAndPassword(userId, userPassword)
    expect(myHash).not.toBeNull() // console.log(myHash, 'length: ' + myHash.length);
    expect(myCrypto.checkUserAndPassword(userId, userPassword, myHash))
  })
})

describe('Test access to website:', () => {
  test(' ... rId and aCode:', () => {
    const rId = '707777ca-9340d80e-03042024-ABDULLAZIZVETVRACHt'
    const aCode = '96978FFDB4D1AE9331346FAAEB9229BA'
    const result = utils.hasAccessVsCode(rId,aCode);
    expect(result).toBeTruthy(); 
    const invalidResult = utils.hasAccessVsCode(rId,aCode + 'test');
    expect(invalidResult).not.toBeTruthy(); 
  })
})

// https://localhost:8443/reception?rId=2bc1f801-14b95cf2-03042024-ULUGBEKBAHODYROVICH&aCode=A66470A6320126A8072B1C73939A558E