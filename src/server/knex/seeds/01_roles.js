/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    { id: 'admin', description: 'Администратор' },
    { id: 'manager', description: 'Менеджер КПП' },
    { id: 'kpp', description: 'Оператор КПП' },
    { id: '1c', description: 'Оператор 1С' },
    { id: 'blocked', description: 'Заблокирован' }
  ]);
};
