/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('items').del()
  await knex('items').insert([
    {state: 'INCOMPLETE', description: 'Buy vegetables', createdAt: "2021-05-12T11:24:31.567Z"},
    {state: 'COMPLETE', description: 'Go walk the dog', createdAt: "2021-07-12T17:24:37.224Z", completedAt: "2021-07-12T19:25:37.224Z"},
    {state: 'COMPLETE', description: 'Replace the light bulbs', createdAt: "2021-04-12T21:24:58.897Z", completedAt: "2024-12-24T15:25:37.224Z"}
  ]);
};
