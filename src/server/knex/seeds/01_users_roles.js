/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users_roles').del()
  await knex('roles').del()
  await knex('roles').insert([
    { id: 'admin', description: 'Администратор' },
    // { id: 'manager', description: 'Менеджер КПП' },
    { id: 'kpp', description: 'Оператор КПП' },
    { id: '1c', description: 'Оператор 1С' },
    { id: 'registered', description: 'Заблокирован' }
  ])
}
