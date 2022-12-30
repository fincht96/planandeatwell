import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('supermarkets').del();
  await knex.raw('ALTER SEQUENCE supermarkets_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('supermarkets').insert([
    {
      name: 'Aldi',
      description: 'Aldi is a great supermarket',
    },
    {
      name: 'Tesco',
      description: 'Tesco is even better',
    },
    {
      name: 'Sainsburys',
      description: 'Sainburys is the best',
    },
    {
      name: 'Asda',
      description: 'Asda is the greatest',
    },
  ]);
}
