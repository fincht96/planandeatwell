import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_plan_recipes').del();
  await knex.raw('ALTER SEQUENCE recipe_plan_recipes_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipe_plan_recipes').insert([
    { recipe_plan_id: 1, recipe_id: 1 },
    { recipe_plan_id: 1, recipe_id: 2 },
  ]);
}
