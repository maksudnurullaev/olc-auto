/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('transports_types').del()

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

}
