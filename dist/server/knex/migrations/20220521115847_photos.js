"use strict";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('photos', function (table) {
    table.string('url').notNullable().index().primary();
    // table.string('date_ymd').notNullable().index();
    table.string('description');
    // table.string('car_number', 15).index().references('id').inTable('cars').onDelete('CASCADE');
    // table.string('in_out_infos_id', 15).index().references('id').inTable('in_out_infos').onDelete('CASCADE');
    // table.string('car_number', 15).index().references('id').inTable('cars');
    table.integer('in_out_infos_id', 11).unsigned().notNullable().index().references('id').inTable('in_out_infos');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('photos');
};