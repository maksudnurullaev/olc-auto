const request = require("supertest")

const app = "./web-services.js"
// const app = ws.app;

describe("Get root(/) API response", () => {
    test("GET /", () => {
        request(app)
            .get("/")
            .expect(200)
            .expect((res) => {
                res.body.data.result == true;
            });
    });
});