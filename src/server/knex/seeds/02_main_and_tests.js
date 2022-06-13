/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const test_car_1 = 'TESTCAR1'
const test_car_2 = 'TESTCAR2'
const test_car_3 = 'TESTCAR3'

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('photos').del()
  await knex('in_out_infos').del()
  await knex('transports_types').del()
  await knex('cars').del()

  await knex('cars').insert([
    { number: test_car_1 },
    { number: test_car_2 },
    { number: test_car_3 }
  ])

  await knex('transports_types').insert([
    { id: 1, name: 'Авиа доставка (фура)', code_length: 0 },
    { id: 2, name: 'Вагон', code_length: 9 },
    { id: 3, name: 'Контейнеры', code_length: 12 },
    { id: 4, name: 'Легковой транспорт', code_length: 0 },
    { id: 5, name: 'Полувагон', code_length: 9 },
    { id: 6, name: 'Самоход', code_length: 0 },
    { id: 7, name: 'Трейлер', code_length: 0 },
    { id: 8, name: 'Фитинговая платформа', code_length: 0 },
    { id: 9, name: 'Фура', code_length: 1 }
  ])

  await knex('in_out_infos').insert([
    {
      id: 1,
      car_number: test_car_1,
      date_ymd: '2022-06-09',
      ttype_id: 1,
      code: '',
      in_datetime: '2022-06-09T05:58',
      out_datetime: null,
      contragent: null,
      driver_phone: null,
      comment: null,
      who_in_checked: 'admin'
    },
    {
      id: 2,
      car_number: test_car_2,
      date_ymd: '2022-06-09',
      ttype_id: 1,
      code: '',
      in_datetime: '2022-06-09T05:58',
      out_datetime: null,
      contragent: null,
      driver_phone: null,
      comment: null,
      who_in_checked: 'admin'
    },
    {
      id: 3,
      car_number: test_car_3,
      date_ymd: '2022-06-09',
      ttype_id: 1,
      code: '',
      in_datetime: '2022-06-09T05:58',
      out_datetime: null,
      contragent: null,
      driver_phone: null,
      comment: null,
      who_in_checked: 'admin'
    }
  ])

  await knex('photos').insert([
    { url: 'photo-url-1-1', in_out_infos_id: 1, description: 'photo-1-1 description' },
    { url: 'photo-url-2-1', in_out_infos_id: 2, description: 'photo-2-1 description' },
    { url: 'photo-url-2-2', in_out_infos_id: 2, description: 'photo-2-2 description' },
    { url: 'photo-url-3-1', in_out_infos_id: 3, description: 'photo-3-1 description' },
    { url: 'photo-url-3-2', in_out_infos_id: 3, description: 'photo-3-1 description' },
    { url: 'photo-url-3-3', in_out_infos_id: 3, description: 'photo-3-1 description' }
  ])
}
