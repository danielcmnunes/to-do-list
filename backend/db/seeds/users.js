/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      username: 'daniel', email: 'test@example.com', 
      password: '$2b$10$bNDXKjoEbfqSymevtWdxH.TNjUM4mGau6d800y5Zz.6bQHW4pwx1e'
    },
    {
      id: 2,
      username: 'daniel2', email: 'test2@example.com', 
      password: '$2b$10$cUOhGNXz0xhqjxoDjaKuGu5j7/0Un6DqpmnUoAmbWHUHMmO4F4cPa'
    },
    {
      id: 3,
      username: 'joao silva', email: 'joao@example.com', 
      password: '123456'
    },
    {
      id: 4,
      username: 'maria silva', email: 'maria@example.com', 
      password: '123456'
    }
  ]);
};
