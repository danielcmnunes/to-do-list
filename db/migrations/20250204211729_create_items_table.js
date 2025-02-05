/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.
        createTable('items', function (table) {
            table.increments('id');
            table.enu('state', ['INCOMPLETE', 'COMPLETE']);
            table.string('description');
            table.datetime('createdAt');
            table.datetime('completedAt').defaultTo(null);
            table.unique('description')
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('items');
};
