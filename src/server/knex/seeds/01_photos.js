/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('photos').del()
  await knex('photos').insert([
    {url: 'photo-url-1-1', car_id: 'car-1', description: 'photo-1-1 description'},
    {url: 'photo-url-2-1', car_id: 'car-2', description: 'photo-2-1 description'},
    {url: 'photo-url-2-2', car_id: 'car-2', description: 'photo-2-2 description'},
    {url: 'photo-url-3-1', car_id: 'car-3', description: 'photo-3-1 description'},
    {url: 'photo-url-3-2', car_id: 'car-3', description: 'photo-3-1 description'},
    {url: 'photo-url-3-3', car_id: 'car-3', description: 'photo-3-1 description'},
  ]);
};
