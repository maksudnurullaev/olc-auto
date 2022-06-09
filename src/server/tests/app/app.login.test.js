const request = require("supertest");
const app_ws = require("../../app-ws");
const knex = require("../../knex/knex")
const testUtils = require('../utils')

const express = require('express');
var app = express();
const session = require('express-session');
app.use(session({
  secret: 'TEST-WppQ38S-4D44-2C44',
  resave: true,
  saveUninitialized: true
}));

app.all('*', function (req, res, next) {
  req.session.userRole = 'admin';
  next();
});

app.use(app_ws);

//  var tables = [
//   'users',
//   'roles',
//   'users_roles'
// ];

describe("Test WS-API vs Objection.js for:", () => {
  beforeAll(() => {
    // return testUtils.beforeAll(tables);
    return testUtils.beforeAll();
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

  let newAdminPassword = '111111';

  test(" ... POST  /changePassword: admin, change password", () => {
    return request(app)
      .post("/changePassword")
      .send({ userId: 'admin', newUserPassword: newAdminPassword })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true);
        expect(_data.message).toEqual('Password changed!');
      })
  });

  test(" ... POST  /login: admin, with new password", () => {
    return request(app)
      .post("/login")
      .send({ id: 'admin', password: newAdminPassword })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true);
        expect(_data.user.role).toEqual('admin');
        expect(_data.user.id).toEqual('admin');
      })
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
