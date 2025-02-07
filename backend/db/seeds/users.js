/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      username: 'daniel', email: 'test@example.com', 
      password: '123', token: '', 
      createdAt: "2025-06-02T08:24:31.567Z"
    },
    {
      username: 'joao silva', email: 'joao@example.com', 
      password: '123456',  token: '', 
      createdAt: "2025-06-02T08:25:31.897Z"
    },
    {
      username: 'maria silva', email: 'maria@example.com', 
      password: '12345678', token: '', 
      createdAt: "2025-06-02T08:26:31.453Z"
    }
  ]);
};
