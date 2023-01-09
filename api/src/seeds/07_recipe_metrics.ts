import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_metrics').del();
  await knex.raw('ALTER SEQUENCE recipe_metrics_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipe_metrics').insert([
    { recipe_id: 1, ingredients_count: 12, price_per_serving: 3.35 },
    { recipe_id: 2, ingredients_count: 12, price_per_serving: 2.65 },
    { recipe_id: 3, ingredients_count: 11, price_per_serving: 4.56 },
  ]);
}
