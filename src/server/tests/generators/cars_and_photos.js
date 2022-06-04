const request = require("supertest");
const app = require("../../app-ws");
const utils = require("../../../utils/utils");
const req = request(app);
const knex = require('../../knex/knex');

function generate(cars_number, dates_number, photos_max_number) {
    for (var i = 1; i <= cars_number; i++) {
        let next_car = 'TESTCAR' + i;
        console.log("Next car:", next_car);
        for (var id = 1; id <= dates_number; id++) {
            let _date = randomDate(new Date(2012, 0, 1), new Date()),
                next_date = utils.formateDate(_date)
            console.log(" . next date:", next_date);
            let lastOutState = photos_max_number - 2;
            for (var ip = 1; ip <= photos_max_number; ip++) {
                let next_state = (lastOutState >= ip ? 'In' : 'Out');
                console.log(" .. next photo:", next_state);
                req.post('/getCameraImage')
                    .send({
                        carID: next_car,
                        forDate: next_date,
                        cameraIp: 'fakeIP',
                        carState: next_state
                    })
                    .then((response) => {
                        console.log("Response", response.body)
                    });
            }
        }
    }
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function main() {
        cars_number = 5;
        dates_number = 5;
        photos_max_number = 5;
        console.log("Generate data for", cars_number, 'cars,', dates_number, 'random dates and', photos_max_number, 'random phoros!');
        generate(cars_number, dates_number, photos_max_number);
}

main();