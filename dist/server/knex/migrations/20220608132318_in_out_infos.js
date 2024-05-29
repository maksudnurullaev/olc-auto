"use strict";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('in_out_infos', function (table) {
    table.increments('id').primary();
    table.string('date_ymd', 11).notNullable().index();
    table.string('car_number', 15).index().references('number').inTable('cars');
    // table.integer('ttype_id', 11).unsigned().index().references('id').inTable('transports_types')
    // table.string('org', 16).notNullable()
    // table.string('in_kpp', 16).notNullable()
    table.string('in_datetime', 32).notNullable();
    // table.string('out_kpp', 16)
    // table.string('out_datetime', 32)
    // table.string('who_in_checked', 32).notNullable() // from session on create
    // table.string('who_out_checked', 32) // from session on update
    // table.string('code', 32)
    // table.string('contragent', 32)
    // table.string('driver_phone', 32)
    table.string('comment', 128);
    // table.boolean('is_sent_to_1c').defaultTo(false)
    // table.string('who_sent_to_1c', 32)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('in_out_infos');
};