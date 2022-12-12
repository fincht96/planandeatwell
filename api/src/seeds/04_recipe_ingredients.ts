import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_ingredients').del();
  await knex.raw('ALTER SEQUENCE recipe_ingredients_id_seq RESTART WITH 1');

  // Inserts seed entries
  const res = await knex('recipe_ingredients').insert([
    // recipe 1
    {
      recipe_id: 1,
      ingredient_id: 1,
      unit_quantity: 0.46,
    },
    {
      recipe_id: 1,
      ingredient_id: 3,
      unit_quantity: 1,
    },

    {
      recipe_id: 1,
      ingredient_id: 4,
      unit_quantity: 1,
    },

    {
      recipe_id: 1,
      ingredient_id: 5,
      unit_quantity: 0.66,
    },

    {
      recipe_id: 1,
      ingredient_id: 6,
      unit_quantity: 1,
    },

    {
      recipe_id: 1,
      ingredient_id: 7,
      unit_quantity: 0.5,
    },

    {
      recipe_id: 1,
      ingredient_id: 8,
      unit_quantity: 0.37,
    },

    {
      recipe_id: 1,
      ingredient_id: 9,
      unit_quantity: 0.17,
    },

    {
      recipe_id: 1,
      ingredient_id: 10,
      unit_quantity: 0.61,
    },

    {
      recipe_id: 1,
      ingredient_id: 2,
      unit_quantity: 1,
    },

    {
      recipe_id: 1,
      ingredient_id: 12,
      unit_quantity: 1,
    },

    {
      recipe_id: 1,
      ingredient_id: 13,
      unit_quantity: 0.4,
    },

    // recipe 2

    {
      recipe_id: 2,
      ingredient_id: 13,
      unit_quantity: 0.8,
    },

    {
      recipe_id: 2,
      ingredient_id: 14,
      unit_quantity: 1,
    },

    {
      recipe_id: 2,
      ingredient_id: 15,
      unit_quantity: 0.08,
    },

    {
      recipe_id: 2,
      ingredient_id: 16,
      unit_quantity: 0.5,
    },

    {
      recipe_id: 2,
      ingredient_id: 17,
      unit_quantity: 1,
    },
    {
      recipe_id: 2,
      ingredient_id: 18,
      unit_quantity: 0.125,
    },

    {
      recipe_id: 2,
      ingredient_id: 19,
      unit_quantity: 0.225,
    },

    {
      recipe_id: 2,
      ingredient_id: 20,
      unit_quantity: 0.11,
    },

    {
      recipe_id: 2,
      ingredient_id: 21,
      unit_quantity: 0.5,
    },

    {
      recipe_id: 2,
      ingredient_id: 22,
      unit_quantity: 0.42,
    },

    {
      recipe_id: 2,
      ingredient_id: 23,
      unit_quantity: 1,
    },

    {
      recipe_id: 2,
      ingredient_id: 24,
      unit_quantity: 0.32,
    },

    // recipe 3

    {
      recipe_id: 3,
      ingredient_id: 25,
      unit_quantity: 1,
    },
    {
      recipe_id: 3,
      ingredient_id: 26,
      unit_quantity: 1,
    },
    {
      recipe_id: 3,
      ingredient_id: 27,
      unit_quantity: 1,
    },
    {
      recipe_id: 3,
      ingredient_id: 28,
      unit_quantity: 0.16,
    },
    {
      recipe_id: 3,
      ingredient_id: 29,
      unit_quantity: 1,
    },
    {
      recipe_id: 3,
      ingredient_id: 30,
      unit_quantity: 0.33,
    },
    {
      recipe_id: 3,
      ingredient_id: 31,
      unit_quantity: 0.06,
    },
    {
      recipe_id: 3,
      ingredient_id: 32,
      unit_quantity: 0.26,
    },
    {
      recipe_id: 3,
      ingredient_id: 33,
      unit_quantity: 0.075,
    },
    {
      recipe_id: 3,
      ingredient_id: 20,
      unit_quantity: 0.22,
    },
    {
      recipe_id: 3,
      ingredient_id: 34,
      unit_quantity: 0.2,
    },
  ]);
}
