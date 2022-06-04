/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('cars').del()
  await knex('cars').insert([
    {id: 'car-1', state: 'I'},
    {id: 'car-2', state: 'O'},
    {id: 'car-3', state: 'I'}
  ]);
};
