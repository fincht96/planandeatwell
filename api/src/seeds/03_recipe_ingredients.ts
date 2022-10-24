import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_ingredients').del();
  await knex.raw('ALTER SEQUENCE recipe_ingredients_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipe_ingredients').insert([
    {
      recipe_id: 1,
      ingredient_id: 1,
      unit_quantity: 0.46,
      price: 0.34,
    },
    {
      recipe_id: 1,
      ingredient_id: 3,
      unit_quantity: 1,
      price: 0.75,
    },

    {
      recipe_id: 1,
      ingredient_id: 4,
      unit_quantity: 1,
      price: 0.85,
    },

    {
      recipe_id: 1,
      ingredient_id: 5,
      unit_quantity: 0.66,
      price: 0.76,
    },

    {
      recipe_id: 1,
      ingredient_id: 6,
      unit_quantity: 1,
      price: 1.5,
    },

    {
      recipe_id: 1,
      ingredient_id: 7,
      unit_quantity: 0.5,
      price: 0.25,
    },

    {
      recipe_id: 1,
      ingredient_id: 8,
      unit_quantity: 0.37,
      price: 0.5,
    },

    {
      recipe_id: 1,
      ingredient_id: 9,
      unit_quantity: 0.17,
      price: 0.43,
    },

    {
      recipe_id: 1,
      ingredient_id: 10,
      unit_quantity: 0.61,
      price: 0.4,
    },

    {
      recipe_id: 1,
      ingredient_id: 2,
      unit_quantity: 1,
      price: 0.7,
    },

    {
      recipe_id: 1,
      ingredient_id: 12,
      unit_quantity: 1,
      price: 0.79,
    },

    {
      recipe_id: 1,
      ingredient_id: 13,
      unit_quantity: 0.4,
      price: 0.34,
    },
  ]);
}
