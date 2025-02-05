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
            table.datetime('createdAt', options={useTz: true, precision: 3}).defaultTo(null);
            table.timestamp('completedAt', options={useTz: true, precision: 3}).defaultTo(null);
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
