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
      price_per_serving: 2.0,
      image_path: '/recipe_images/aldi/greek-fajitas.jpg',
      link: 'https://www.aldi.co.uk/greek-fajitas-/p/000000460308800',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['vegetarian'],
    },
    {
      name: 'Vegan Pesto Pasta',
      servings: 4,
      price_per_serving: 1.43,
      image_path: '/recipe_images/aldi/vegan-pesto-pasta.jpg',
      link: 'https://www.aldi.co.uk/vegan-pesto-pasta/p/000000481143300',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['vegan'],
    },
    {
      name: 'Fish Pie',
      servings: 4,
      price_per_serving: 3.01,
      image_path: '/recipe_images/aldi/fish-pie.jpg',
      link: 'https://www.aldi.co.uk/fish-pie/p/000000093912700',
      meal_type: ['dinner', 'lunch'],
      lifestyle_type: ['pescatarian'],
    },
  ]);
}
