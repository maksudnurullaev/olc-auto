const request = require("supertest");
const app = require("../app-ws");
const knex = require("../knex/knex")

// beforeAll(() => {
//   console.log('process.env.NODE_ENV', process.env.NODE_ENV);
//   process.env.NODE_ENV = 'test'
//   console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// });

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
    let carId1 = 'car-1';
    return request(app)
      .get("/cars/" + carId1)
      .then(response => {
        let _data = eval(response.body);
        expect(_data.result);
        expect(_data.car.id).toBe(carId1);
        expect(_data.car.photos);
        expect(_data.car.photos.length).toBe(1);
        expect(response.statusCode).toBe(200);
      });
  });


  afterAll(() => {
    knex.destroy();
  })
});
