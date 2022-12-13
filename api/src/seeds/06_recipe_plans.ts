import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_plans').del();
  await knex.raw('ALTER SEQUENCE recipe_plans_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipe_plans').insert([{}]);
}
