/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.
        createTable('users', function (table) {
            table.increments('id').notNullable();
            table.string('username').notNullable();
            table.string('email').notNullable();
            table.string('password').notNullable();

            table.unique('username');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('users');
};
