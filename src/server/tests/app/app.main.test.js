const express = require('express');
var app = express();
const session = require('express-session');
app.use(session({
  secret: 'TEST-WppQ38S-4D44-2C44',
  resave: true,
  saveUninitialized: true
}));

app.all('*', function (req, res, next) {
  //authenticated(req, res, next);
  //OR
  req.session.userRole = 'admin';
  next();
});

const request = require("supertest");
const app_ws = require("../../app-ws");
const knex = require("../../knex/knex")
const testUtils = require('../utils')

app.use(app_ws);

var tables = [
  'cars',
  'photos'
];

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
    return testUtils.beforeAll(tables);
  });

  test(" ... GET  /cars/: get all test cars", () => {
    return request(app)
      .get("/cars/")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.cars.length).toBe(3);
        expect(response.statusCode).toBe(200);
      });
  });

  test(" ... GET  /cars/invalidCarID: Invalid car ID", () => {
    return request(app)
      .get("/cars/invalidCarId")
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result).toBe(false);
        expect(response.statusCode).toBe(404);
      });
  });

  test(" ... GET  /cars/car-1: valid Car ID #1", () => {
    let carId = 'car-1';
    return request(app)
      .get("/cars/" + carId)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.id).toBe(carId);
        expect(_data.car.photos);
        expect(_data.car.photos.length).toBe(1);
        expect(response.statusCode).toBe(200);
      });
  });

  test(" ... GET  /cars/car-2: valid Car ID #2", () => {
    let carId = 'car-2';
    return request(app)
      .get("/cars/" + carId)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.id).toBe(carId);
        expect(_data.car.photos);
        expect(_data.car.photos.length).toBe(2);
        expect(response.statusCode).toBe(200);
      });
  });

  test(" ... GET  /cars/car-2: valid Car ID #3", () => {
    let carId = 'car-3';
    return request(app)
      .get("/cars/" + carId)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.id).toBe(carId);
        expect(_data.car.photos);
        expect(_data.car.photos.length).toBe(3);
        expect(response.statusCode).toBe(200);
      });
  });

  afterAll(() => {
    knex.destroy();
  })
});
