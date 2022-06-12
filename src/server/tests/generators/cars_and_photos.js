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

function cleanTestData () {
  return knex('photos').delete().then(() => {
    return knex('in_out_infos').delete().then(() => {
      return knex('cars').delete()
    })
  })
}

function finish () {
  knex.destroy()
}

function generate (cars_number, infos_number, photos_max_number) {
  cleanTestData().then(async () => {
    for (let i = 1; i <= cars_number; i++) {
      const next_car = 'TESTCAR' + i
      const p = await knex('cars').insert({ number: next_car }).then(async () => {
        console.log('Created car: ' + next_car)

        for (let ini = 1; ini <= infos_number; ini++) {
          const _date = randomDate(new Date(2022, 0, 1), new Date())
          const next_date = utils.ymdFormateDate(_date)
          const next_info = {
            // id: ini,
            car_number: next_car,
            date_ymd: next_date,
            ttype_id: 1,
            code: '',
            in_datetime: next_date + 'T01:01',
            out_datetime: null,
            contragent: null,
            driver_phone: null,
            comment: null,
            who_in_checked: 'admin'
          }
          await knex('in_out_infos').insert(next_info).then(async (ioInfoId) => {
            console.log(`Created info(${ioInfoId[0]}) for car ${next_car}`)

            await req.post('/login')
              .send({ id: 'admin', password: 'admin' })
              .then(async (response) => {
                const _data = eval(response.body)
                if (_data.result) {
                  const lastOutState = photos_max_number - 2
                  for (let ip = 1; ip <= photos_max_number; ip++) {
                    const next_state = (lastOutState >= ip ? 'In' : 'Out')
                    console.log(' .. next photo:', next_state)
                    await req.post('/login')
                      .send({
                        id: 'admin',
                        password: 'admin'
                      })
                    await req.post('/getCameraImage')
                      .send({
                        carID: next_car,
                        ioInfoId: ioInfoId[0],
                        forDate: next_date,
                        cameraIp: 'fakeIP',
                        carState: next_state
                      })
                      .then((response) => {
                        console.log('Response', response.body)
                      })
                  }
                }
              })
          })
        };
      })
    }
    finish()
  })
};

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function main () {
  cars_number = 5
  infos_number = 5
  photos_max_number = 10
  console.log('Generate data for', cars_number, 'cars,', ' and', photos_max_number, 'random phoros!')
  generate(cars_number, infos_number, photos_max_number)
}

main()
