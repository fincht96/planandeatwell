import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipes').del();
  await knex.raw('ALTER SEQUENCE recipes_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipes').insert([
    {
      name: 'Greek Fajitas',
      base_servings: 4,
      price_per_serving: 2.0,
      image_path: '/recipe_images/aldi/greek-fajitas.jpg',
      link: 'https://www.aldi.co.uk/greek-fajitas-/p/000000460308800',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['vegetarian'],
      free_from_type: ['dairy_free'],
      prep_time: 10,
      cook_time: 20,
      supermarket_id: 1,
    },
    {
      name: 'Vegan Pesto Pasta',
      base_servings: 4,
      price_per_serving: 1.43,
      image_path: '/recipe_images/aldi/vegan-pesto-pasta.jpg',
      link: 'https://www.aldi.co.uk/vegan-pesto-pasta/p/000000481143300',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['vegan'],
      prep_time: 5,
      cook_time: 10,
      supermarket_id: 1,
    },
    {
      name: 'Fish Pie',
      base_servings: 4,
      price_per_serving: 3.01,
      image_path: '/recipe_images/aldi/fish-pie.jpg',
      link: 'https://www.aldi.co.uk/fish-pie/p/000000093912700',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['pescatarian'],
      free_from_type: ['gluten_free'],
      prep_time: 10,
      cook_time: 30,
      supermarket_id: 2,
    },
  ]);
}
