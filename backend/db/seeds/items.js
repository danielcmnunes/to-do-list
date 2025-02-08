/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('items').del()
  await knex('items').insert([
    {userId: '1', state: 'INCOMPLETE', description: 'Buy vegetables', createdAt: "2021-05-12T11:24:31.567Z"},
    {userId: '1', state: 'INCOMPLETE', description: 'Go walk the dog', createdAt: "2021-07-12T17:24:37.224Z", completedAt: "2021-07-12T19:25:37.224Z"},
    {userId: '1', state: 'COMPLETE', description: 'Replace the light bulbs', createdAt: "2021-04-12T21:24:58.897Z", completedAt: "2024-12-24T15:25:37.224Z"},
    
    {userId: '2', state: 'INCOMPLETE', description: 'Buy a car', createdAt: "2021-05-12T11:25:31.567Z"},    
    {userId: '2', state: 'INCOMPLETE', description: 'Buy a mansion', createdAt: "2021-05-12T11:26:31.567Z"},
    {userId: '2', state: 'INCOMPLETE', description: 'Buy a yacht', createdAt: "2021-05-12T11:28:31.567Z"}
  ]);
};
