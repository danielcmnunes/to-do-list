/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.
        createTable('items', function (table) {
            table.increments('id').notNullable();
            table.string('userId').notNullable();
            table.enu('state', ['INCOMPLETE', 'COMPLETE']).notNullable();
            table.string('description').notNullable();
            table.datetime('createdAt').notNullable();
            table.datetime('completedAt').defaultTo(null);
            table.unique(['userId', 'description'])
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
