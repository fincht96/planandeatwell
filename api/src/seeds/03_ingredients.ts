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
      category_id: 3,
      supermarket_id: 1,
      base_value: 1,
      unit: 'kilogram',
    },
    {
      name: 'Everyday Essentials Greek Style Salad Cheese 200g',
      price_per_unit: 0.7,
      category_id: 21,
      supermarket_id: 2,
      base_value: 200,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Aubergine Each",
      price_per_unit: 0.75,
      category_id: 3,
      supermarket_id: 2,
      base_value: 1,
      unit: 'aubergine',
    },

    {
      name: 'Village Bakery Super Soft Original Wraps 8 Pack',
      price_per_unit: 0.85,
      category_id: 2,
      supermarket_id: 1,
      base_value: 8,
      unit: 'roll',
    },

    {
      name: "Nature's Pick Courgettes 500g",
      price_per_unit: 1.15,
      category_id: 3,
      supermarket_id: 3,
      base_value: 500,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Mixed Sweet Pepper 3 Pack",
      price_per_unit: 1.5,
      category_id: 3,
      supermarket_id: 3,
      base_value: 3,
      unit: 'pepper',
    },

    {
      name: "Nature's Pick Red Chillies 65g",
      price_per_unit: 0.5,
      category_id: 3,
      supermarket_id: 1,
      base_value: 65,
      unit: 'gram',
    },

    {
      name: 'Specially Selected Basil & Oregano Passata 700g',
      price_per_unit: 1.35,
      category_id: 3,
      supermarket_id: 1,
      base_value: 700,
      unit: 'gram',
    },

    {
      name: 'Solesta Extra Virgin Olive Oil 750ml',
      price_per_unit: 2.85,
      category_id: 14,
      supermarket_id: 1,
      base_value: 750,
      unit: 'milliliter',
    },

    {
      name: 'The Deli Pitted Black Olives 340g (165g Drained)',
      price_per_unit: 0.65,
      category_id: 3,
      supermarket_id: 1,
      base_value: 340,
      unit: 'gram',
    },

    {
      name: 'The Deli Sour Cream & Chive Dip 200g',
      price_per_unit: 0.79,
      category_id: 21,
      supermarket_id: 1,
      base_value: 200,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Limes 5 Pack",
      price_per_unit: 0.85,
      category_id: 3,
      supermarket_id: 2,
      base_value: 5,
      unit: 'lime',
    },

    {
      name: 'Foodie Market Pine Nuts 60g',
      price_per_unit: 1.49,
      category_id: 13,
      supermarket_id: 1,
      base_value: 60,
      unit: 'gram',
    },

    {
      name: 'Cucina Penne 500g',
      price_per_unit: 0.75,
      category_id: 22,
      supermarket_id: 2,
      base_value: 500,
      unit: 'gram',
    },

    {
      name: 'Foodie Market Sunflower Seeds 250g',
      price_per_unit: 1.25,
      category_id: 13,
      supermarket_id: 1,
      base_value: 250,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Garlic 4 Pack",
      price_per_unit: 0.79,
      category_id: 3,
      supermarket_id: 1,
      base_value: 4,
      unit: 'garlic',
    },

    {
      name: "Nature's Pick Cut Basil 30g",
      price_per_unit: 0.52,
      category_id: 3,
      supermarket_id: 1,
      base_value: 30,
      unit: 'gram',
    },

    {
      name: 'Everyday Essentials Lemons 4 Pack',
      price_per_unit: 0.5,
      category_id: 3,
      supermarket_id: 1,
      base_value: 4,
      unit: 'lemon',
    },

    {
      name: "Nature's Pick Onions 1kg",
      price_per_unit: 0.49,
      category_id: 3,
      supermarket_id: 3,
      base_value: 1,
      unit: 'kilogram',
    },

    {
      name: 'Four Seasons British Garden Peas 900g',
      price_per_unit: 0.65,
      category_id: 3,
      supermarket_id: 1,
      base_value: 900,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Shredded Kale 200g",
      price_per_unit: 0.75,
      category_id: 3,
      supermarket_id: 2,
      base_value: 200,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Baby Spinach 240g",
      price_per_unit: 0.76,
      category_id: 3,
      supermarket_id: 1,
      base_value: 240,
      unit: 'gram',
    },

    {
      name: "Nature's Pick Asparagus Tips 100g",
      price_per_unit: 1.39,
      category_id: 3,
      supermarket_id: 1,
      base_value: 100,
      unit: 'gram',
    },

    {
      name: 'Foodie Market Seed Mix 250g',
      price_per_unit: 1.25,
      category_id: 13,
      supermarket_id: 2,
      base_value: 250,
      unit: 'gram',
    },

    {
      name: 'The Fishmonger Smoked Haddock Fillets 230g/2 Pack',
      price_per_unit: 3.29,
      category_id: 4,
      supermarket_id: 1,
      base_value: 230,
      unit: 'gram',
    },

    {
      name: 'The Fishmonger Boneless Salmon Fillets 240g/2 Pack',
      price_per_unit: 3.39,
      category_id: 4,
      supermarket_id: 1,
      base_value: 240,
      unit: 'gram',
    },

    {
      name: 'The Fishmonger Cod Fillets 250g/2 Pack',
      price_per_unit: 3.29,
      category_id: 4,
      supermarket_id: 3,
      base_value: 250,
      unit: 'gram',
    },

    {
      name: 'Ready, Set…Cook! Parsley 8g',
      price_per_unit: 0.44,
      category_id: 3,
      supermarket_id: 1,
      base_value: 8,
      unit: 'gram',
    },

    {
      name: 'Cucina Creamy Lasagne Sauce 480g',
      price_per_unit: 0.75,
      category_id: 14,
      supermarket_id: 3,
      base_value: 480,
      unit: 'gram',
    },

    {
      name: 'Cowbelle British Double Fresh Cream 300ml',
      price_per_unit: 1.09,
      category_id: 21,
      supermarket_id: 2,
      base_value: 300,
      unit: 'milliliter',
    },

    {
      name: 'The Pantry Lemon Juice 250ml',
      price_per_unit: 0.39,
      category_id: 14,
      supermarket_id: 1,
      base_value: 250,
      unit: 'milliliter',
    },

    {
      name: 'Everyday Essentials Potatoes 2.5kg',
      price_per_unit: 1.05,
      category_id: 3,
      supermarket_id: 2,
      base_value: 2.5,
      unit: 'kilogram',
    },

    {
      name: 'Emporium British Extra Mature Cheddar Cheese 400g',
      price_per_unit: 2.65,
      category_id: 21,
      supermarket_id: 1,
      base_value: 400,
      unit: 'gram',
    },

    {
      name: 'Four Seasons Supersweet Sweetcorn 1kg',
      price_per_unit: 1.25,
      category_id: 3,
      supermarket_id: 2,
      base_value: 1,
      unit: 'kilogram',
    },
  ]);
}
