import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('ingredients').del();
  await knex.raw('ALTER SEQUENCE ingredients_id_seq RESTART WITH 1');
  //   await knex.raw('ALTER TABLE ingredients AUTO_INCREMENT = 1');

  //   knex.raw('ALTER TABLE ' + 'ingredients' + ' AUTO_INCREMENT = 1');

  // Inserts seed entries
  await knex('ingredients').insert([
    {
      name: "Nature's Pick Red Onions 1kg",
      price_per_unit: 0.75,
    },
    {
      name: 'Everyday Essentials Greek Style Salad Cheese 200g',
      price_per_unit: 0.7,
    },
    {
      name: 'Everyday Essentials Greek Style Salad Cheese 200g',
      price_per_unit: 0.7,
    },

    {
      name: "Nature's Pick Aubergine Each",
      price_per_unit: 0.75,
    },

    {
      name: 'Village Bakery Super Soft Original Wraps 8 Pack',
      price_per_unit: 0.85,
    },

    {
      name: "Nature's Pick Courgettes 500g",
      price_per_unit: 1.15,
    },

    {
      name: "Nature's Pick Red Chillies 65g",
      price_per_unit: 0.5,
    },

    {
      name: "Nature's Pick Red Chillies 65g",
      price_per_unit: 0.5,
    },

    {
      name: 'Specially Selected Basil & Oregano Passata 700g',
      price_per_unit: 1.35,
    },

    {
      name: 'Solesta Extra Virgin Olive Oil 750ml',
      price_per_unit: 2.85,
    },

    {
      name: 'The Deli Pitted Black Olives 340g (165g Drained)',
      price_per_unit: 0.65,
    },

    {
      name: 'The Deli Sour Cream & Chive Dip 200g',
      price_per_unit: 0.79,
    },

    {
      name: "Nature's Pick Limes 5 Pack",
      price_per_unit: 0.85,
    },
  ]);
}
