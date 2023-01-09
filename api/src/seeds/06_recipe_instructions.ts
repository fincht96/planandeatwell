import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('recipe_instructions').del();
  await knex.raw('ALTER SEQUENCE recipe_instructions_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('recipe_instructions').insert([
    {
      recipe_id: 1,
      step: 1,
      instruction: '<p>Do this <strong>blah</strong> blah</p>',
    },
    {
      recipe_id: 1,
      step: 2,
      instruction: 'second step is to do this amazing thing',
    },
    {
      recipe_id: 1,
      step: 3,
      instruction: 'third step is to do this amazing thing',
    },
    {
      recipe_id: 2,
      step: 1,
      instruction: 'first step is to do this amazing thing',
    },
    {
      recipe_id: 2,
      step: 2,
      instruction: 'second step is to do this amazing thing',
    },
    {
      recipe_id: 2,
      step: 3,
      instruction: 'third step is to do this amazing thing',
    },
    {
      recipe_id: 3,
      step: 1,
      instruction: 'first step is to do this amazing thing',
    },
    {
      recipe_id: 3,
      step: 2,
      instruction: 'second step is to do this amazing thing',
    },
    {
      recipe_id: 3,
      step: 3,
      instruction: 'third step is to do this amazing thing',
    },
  ]);
}
