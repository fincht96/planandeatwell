import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipes').del();
  await knex.raw('ALTER SEQUENCE recipes_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipes').insert([
    {
      name: 'Greek Fajitas',
      servings: 4,
    },
    {
      name: 'Vegan Pesto Pasta',
      servings: 4,
    },
  ]);
}
