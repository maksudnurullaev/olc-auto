/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('transports_types').del()
  await knex('transports_types').insert([
    { name: 'Авиа доставка (фура)', code_length: 0 },
    { name: 'Вагон', code_length: 9 },
    { name: 'Контейнеры', code_length: 12 },
    { name: 'Легковой транспорт', code_length: 0 },
    { name: 'Полувагон', code_length: 9 },
    { name: 'Самоход', code_length: 0 },
    { name: 'Трейлер', code_length: 0 },
    { name: 'Фитинговая платформа', code_length: 0 },
    { name: 'Фура', code_length: 1 }
  ]);
};
