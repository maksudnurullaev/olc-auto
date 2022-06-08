/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('in_out_infos', function (table) {
        table.string('car_id', 15).index().references('id').inTable('cars').onDelete('CASCADE');
        table.string('in_datetime', 32).notNullable();
        table.string('out_datetime', 32);
        table.string('who_in_checked', 32).notNullable();
        table.string('who_out_checked', 32);
        table.string('code', 32);
        table.string('contragent', 32);
        table.string('driver_phone', 32);
        table.string('comment', 128);
        table.boolean('is_sent_to_1c').defaultTo(false);
        table.string('who_sent_to_1c', 32).notNullable();
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
