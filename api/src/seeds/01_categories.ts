import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('categories').del();
  //   await knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('categories').insert([
    { id: 1, name: 'Vegan food and drinks' },
    { id: 2, name: 'Bread, pastries and cakes' },
    { id: 3, name: 'Fruit and vegetables' },
    { id: 4, name: 'Fish' },
    { id: 5, name: 'Meat and poultry' },
    { id: 6, name: 'Beers and ciders' },
    { id: 7, name: 'Tea and coffee' },
    { id: 8, name: 'Soft drinks and juices' },
    { id: 9, name: 'Spirits, wines and liqueurs' },
    { id: 10, name: 'Biscuit and crackers' },
    { id: 11, name: 'Breakfast cereal' },
    { id: 12, name: 'Crips and snacks' },
    { id: 13, name: 'Seeds, nuts and dried fruits' },
    { id: 14, name: 'Sauces, oils and dressings' },
    { id: 15, name: 'Tins, cans and packets' },
    { id: 16, name: 'Rice, pasta and noodles' },
    { id: 17, name: 'Home baking' },
    { id: 18, name: 'Jams, spreads and syrups' },
    { id: 19, name: 'Frozen foods' },
    { id: 20, name: 'Ice cream and desserts' },
    { id: 21, name: 'Milk, dairy and eggs' },
    { id: 22, name: 'Pizza, pasta and pasta sauces' },
    { id: 23, name: 'Herbs and spices' },
  ]);
}
