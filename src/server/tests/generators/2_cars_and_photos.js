const request = require('supertest')
const app_ws = require('../../app-ws')

const express = require('express')
const app = express()
const session = require('express-session')

app.use(session({
    secret: 'TEST-WppQ38S-4D44-2C44',
    resave: true,
    saveUninitialized: true
}))

app.all('*', function (req, res, next) {
    req.session.userRole = 'admin'
    next()
})

app.use(app_ws)

const utils = require('../../../utils/utils')
const req = request(app)
const knex = require('../../knex/knex')
const { randomUUID } = require('crypto')

function cleanTestData() {
    return knex('photos').delete().then(() => {
        return knex('in_out_infos').delete().then(() => {
            return knex('cars').delete()
            // .then(() => {
            //     req.post('/login')
            //     .send({ id: 'admin', password: 'admin' })
            //     // .then(() => {
            //     //     console.log("Initial login!");
            //     // }); 
            //     return req
            // })
        })
    })
}   

function finish() {
    return knex.destroy()
}

function generate(cars_number, infos_number, photos_max_number) {
    cleanTestData().then(() => {
        let ps = []
        for (let i = 1; i <= cars_number; i++) {
            const next_car = 'GTESTCAR' + i
            const p = knex('cars').insert({ number: next_car }).then(() => {
                return next_car;
            }).then((car_number) => {
                console.log('Created car: ' + car_number)
                let psi = []
                for (let ini = 1; ini <= infos_number; ini++) {
                    const _date = randomDate(new Date(2022, 1, 1), new Date())
                    const next_date = utils.ymdFormateDate(_date)
                    const next_info = getNewInfo(car_number, next_date);
                    const pi = knex('in_out_infos').insert(next_info).then((ioInfoId) => {
                        console.log(`Created info(${ioInfoId[0]}) for car ${car_number} and date ${next_date}`)
                        // photos generation part - START
                        let psp = []
                        const lastOutState = photos_max_number - 2
                        for (let ip = 1; ip <= photos_max_number; ip++) {
                            const next_state = (lastOutState >= ip ? 'In' : 'Out')
                            console.log(' .. next photo:', next_state)
                            const pp = req.post('/getStreetCameraImage')
                                .send({
                                    carNumber: car_number,
                                    infoId: ioInfoId[0],
                                    forDate: next_date,
                                    cameraIp: 'fakeIP',
                                    carState: next_state
                                })
                                .then((response) => {
                                    console.log('Response', response.body)
                                })
                            psp.push(pp)
                        }
                        return Promise.all(psp)                        
                        // photos generation part - END
                    }).then(() => {
                        console.log('Photos created');
                    })
                    psi.push(pi)
                }
                return Promise.all(psi)
            })
            ps.push(p)
        }
        return Promise.all(ps)
    }).then(() => {
        finish()
        console.log('Done!')
    })
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getNewInfo(car_number, next_date) {
    const next_info = {
        // id: ini,
        car_number,
        org: 'OLC',
        kpp: 'olc-kpp-1',
        date_ymd: next_date,
        ttype_id: 1,
        code: randomUUID(),
        in_datetime: next_date + 'T01:01',
        out_datetime: null,
        contragent: null,
        driver_phone: null,
        comment: null,
        who_in_checked: 'admin'
    }
    return next_info;
}

function main() {
    let cars_number = 6
    let infos_number = 6
    let photos_max_number = 6
    console.log('Generate data for', cars_number, 'cars,', infos_number, "infos", 'and', photos_max_number, 'random photos!')
    generate(cars_number, infos_number, photos_max_number)
}

main()
