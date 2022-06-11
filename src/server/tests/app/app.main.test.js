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

const request = require("supertest");
const app_ws = require("../../app-ws");
const knex = require("../../knex/knex")
const testUtils = require('../utils')

app.use(app_ws);

describe("Test WS-API for:", () => {

  test(" ... GET  /: root path", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test(" ... POST /getImages: bad request, no parameters", () => {
    return request(app)
      .post("/getImages")
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

});

describe("Test WS-API vs Objection.js for:", () => {

  beforeAll(() => {
    return testUtils.beforeAll();
  });

  test(" ... GET  /cars/: get all test cars", () => {
    return request(app)
    .post("/cars/")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.cars.length).toBe(3);
        expect(response.statusCode).toBe(200);
      });
  });

  test(" ... GET  /cars/invalidCarID: Invalid car ID", () => {
    return request(app)
      .post("/cars/invalidCarId")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toBe(false);
        expect(response.statusCode).toBe(200);
      });
  });

  let car_number_1 = 'TESTCAR-1';
  let url_1 = `/cars/${car_number_1}`;
  test(" ... GET  " + url_1, () => {
    return request(app)
      .post(url_1)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.number).toBe(car_number_1);
        expect(response.statusCode).toBe(200);
      });
  });

  let car_number_2 = 'TESTCAR-2';
  let url_2 = `/cars/${car_number_2}/infos`;
  test(" ... GET  " + url_2, () => {
    let car_number = 'TESTCAR-2';
    return request(app)
      .post("/cars/" + car_number + "/infos")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toEqual(true);
        expect(_data.car.number).toEqual(car_number_2);
        expect(_data.car.infos).toBeDefined();
        expect(_data.car.infos.length).toBe(1);
        expect(response.statusCode).toBe(200);
      });
  });

  // test URL: /cars/:carId/infos/:ioInfosId
  let car_number_3 = 'TESTCAR-3';
  let ioInfosId = 3;
  let url_3 = `/cars/${car_number_3}/infos/${ioInfosId}`;
  test(" ... GET  " + url_3, () => {
    return request(app)
      .post(url_3)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.number).toBe(car_number_3);
        expect(_data.car.info).toBeDefined();
        expect(_data.car.info.id).toBe(ioInfosId);
        expect(response.statusCode).toBe(200);
      });
  });

  // test URL: /cars/:carId/infos/:ioInfosId/photos
  let url_4 = `/cars/${car_number_3}/infos/${ioInfosId}/photos`;
  test(" ... GET  " + url_4, () => {
    return request(app)
      .post(url_4)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.car.photos).toBeDefined();
        expect(_data.car.photos.length).toBe(3);
        expect(response.statusCode).toBe(200);
      });
  });

  afterAll(() => {
    knex.destroy();
  })
});
