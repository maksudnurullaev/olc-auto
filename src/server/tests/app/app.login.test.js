const request = require("supertest");
const app = require("../../app-ws");
const knex = require("../../knex/knex")
const testUtils = require('../utils')

var tables = [
  'users',
  'roles',
  'users_roles'
];

describe("Test WS-API vs Objection.js for:", () => {
  beforeAll(() => {
    return testUtils.beforeAll(tables);
  });

  test(" ... POST  /checkLogin: check login status", () => {
    return request(app)
      .post("/checkLogin")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(false); // ... no login yet
      });
  });

  test(" ... POST  /login: admin", () => {
    return request(app)
      .post("/login")
      .send({ id: 'admin', password: 'admin' })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true);
        expect(_data.user.role).toEqual('admin');
        expect(_data.user.id).toEqual('admin');
      })
  })

  test(" ... POST  /login: admin, change password", () => {
    let newPassword = 'dfadfadsfasfasdfasdf';
    return request(app)
      .post("/changePassword")
      .send({ userId: 'admin', newUserPassword: newPassword })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true);
        expect(_data.message).toEqual('Password changed!');
      }).then(() => {
        return request(app)
          .post("/login")
          .send({ id: 'admin', password: newPassword })
          .then(response => {
            let _data = eval(response.body);
            expect(_data.result).toEqual(true);
            expect(_data.user.role).toEqual('admin');
            expect(_data.user.id).toEqual('admin');
          })
      });
  })

  test(" ... POST  /login: not existance user", () => {
    return request(app)
      .post("/login")
      .send({ id: 'notExistanceUser', password: 'notExistancePassword' })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(false);
        expect(_data.message).toEqual('User not found!');
      });
  });

  test(" ... POST  /login: existance user with invalid password", () => {
    return request(app)
      .post("/login")
      .send({ id: 'admin', password: 'notExistancePassword' })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(false);
        expect(_data.message).toEqual('Authentication failed!');
      });
  });

  afterAll(() => {
    knex.destroy();
  })

});
