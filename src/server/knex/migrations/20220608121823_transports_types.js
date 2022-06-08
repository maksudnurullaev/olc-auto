/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transports_types', function (table) {
        table.increments('id').primary();
        table.string('name', 32).notNullable();
        table.integer('code_length').notNullable().defaultTo(0);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transports_types');
};
