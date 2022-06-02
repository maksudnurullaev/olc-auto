const request = require("supertest");
const app = require("../../app-ws");
const knex = require("../../knex/knex")

var tables = [
  'users',
  'roles',
  'users_roles'
];

function prepareDb() {
  let beforeTestsTasks = [];
  // migrate
  beforeTestsTasks.push(knex.migrate.latest().then(() => { console.log(' ... 1. db migrates - done!') }));
  // seed 
  beforeTestsTasks.push(knex.seed.run().then(() => { console.log(' ... 2. db seed - done!') }));
  // truncate 
  tables.forEach((table) => {
    beforeTestsTasks.push(knex(table).truncate().then(() => { console.log(' ... ... truncate: ' + table) }));
  });
  return beforeTestsTasks;
};

describe("Test WS-API vs Objection.js for:", () => {

  beforeAll(() => {
    return Promise.all(prepareDb()).then(() => {
      console.log(' ... db prepared!');
    }).catch((err) => {
      console.error(err);
    })
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
      });
  });

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
