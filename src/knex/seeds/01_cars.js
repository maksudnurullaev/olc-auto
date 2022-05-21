/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('cars').del()
  await knex('cars').insert([
    {id: 'car-1', status: 'car-1 some status', description: 'car-1 description'},
    {id: 'car-2', status: 'car-2 some status', description: 'car-2 description'},
    {id: 'car-3', status: 'car-3 some status', description: 'car-3 description'}
  ]);
};
