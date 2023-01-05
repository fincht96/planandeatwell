import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('meal_plan_recipes').del();
  await knex.raw('ALTER SEQUENCE meal_plan_recipes_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('meal_plan_recipes').insert([
    { meal_plan_id: 1, recipe_id: 1, servings: 4 },
    { meal_plan_id: 1, recipe_id: 2, servings: 8 },
  ]);
}
