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
      name: "Nature's Pick Mixed Sweet Pepper 3 Pack",
      price_per_unit: 1.5,
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

    {
      name: 'Foodie Market Pine Nuts 60g',
      price_per_unit: 1.49,
    },

    {
      name: 'Cucina Penne 500g',
      price_per_unit: 0.75,
    },

    {
      name: 'Foodie Market Sunflower Seeds 250g',
      price_per_unit: 1.25,
    },

    {
      name: "Nature's Pick Garlic 4 Pack",
      price_per_unit: 0.79,
    },

    {
      name: "Nature's Pick Cut Basil 30g",
      price_per_unit: 0.52,
    },

    {
      name: 'Everyday Essentials Lemons 4 Pack',
      price_per_unit: 0.5,
    },

    {
      name: "Nature's Pick Onions 1kg",
      price_per_unit: 0.49,
    },

    {
      name: 'Four Seasons British Garden Peas 900g',
      price_per_unit: 0.65,
    },

    {
      name: "Nature's Pick Shredded Kale 200g",
      price_per_unit: 0.75,
    },

    {
      name: "Nature's Pick Baby Spinach 240g",
      price_per_unit: 0.76,
    },

    {
      name: "Nature's Pick Asparagus Tips 100g",
      price_per_unit: 1.39,
    },

    {
      name: 'Foodie Market Seed Mix 250g',
      price_per_unit: 1.25,
    },

    {
      name: 'The Fishmonger Smoked Haddock Fillets 230g/2 Pack',
      price_per_unit: 3.29,
    },

    {
      name: 'The Fishmonger Boneless Salmon Fillets 240g/2 Pack',
      price_per_unit: 3.39,
    },

    {
      name: 'The Fishmonger Cod Fillets 250g/2 Pack',
      price_per_unit: 3.29,
    },

    {
      name: 'Ready, Set…Cook! Parsley 8g',
      price_per_unit: 0.44,
    },

    {
      name: 'Cucina Creamy Lasagne Sauce 480g',
      price_per_unit: 0.75,
    },

    {
      name: 'Cowbelle British Double Fresh Cream 300ml',
      price_per_unit: 1.09,
    },

    {
      name: 'The Pantry Lemon Juice 250ml',
      price_per_unit: 0.39,
    },

    {
      name: 'Everyday Essentials Potatoes 2.5kg',
      price_per_unit: 1.05,
    },

    {
      name: 'Emporium British Extra Mature Cheddar Cheese 400g',
      price_per_unit: 2.65,
    },

    {
      name: 'Four Seasons Supersweet Sweetcorn 1kg',
      price_per_unit: 1.25,
    },
  ]);
}
