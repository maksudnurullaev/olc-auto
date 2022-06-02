const request = require("supertest");
const app = require("../../app-ws");
const knex = require("../../knex/knex")

var tables = [
  'users',
  'roles',
  'users_roles'
];

function truncate() {
  let truncates = [];
  // truncate tables
  tables.forEach((table) => {
    truncates.push(knex(table).truncate());
  });
  // migrate:latest
  truncates.push(knex.migrate.latest());
  return truncates;
};

describe("Test WS-API vs Objection.js for:", () => {

  beforeAll(async () => {
    return Promise.all(truncate()).finally(() => {
      console.log(' ... truncate - done!');
    });
  });

  test(" ... POST  /checkLogin: check login status", () => {
    return request(app)
      .post("/checkLogin")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(false); // ... no login yet
      });
  });

  test(" ... POST  /login: login", () => {
    return request(app)
      .post("/login")
      .send({ id: 'admin', password: 'admin' })
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true); // ... login as admin
      });
  });

  afterAll(() => {
    knex.destroy();
  })
});
