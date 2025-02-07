/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.
        createTable('users', function (table) {
            table.increments('id');
            table.string('username');
            table.string('email');
            table.string('password');
            table.string('token');
            table.datetime('createdAt');
            table.datetime('lastLogin');
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
