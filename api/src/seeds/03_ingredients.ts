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
      product_id: '4088600185125',
    },
    {
      name: 'Everyday Essentials Greek Style Salad Cheese 200g',
      price_per_unit: 0.7,
      category_id: 21,
      supermarket_id: 2,
      base_value: 200,
      unit: 'gram',
      product_id: '4088600285450',
    },

    {
      name: "Nature's Pick Aubergine Each",
      price_per_unit: 0.75,
      category_id: 3,
      supermarket_id: 2,
      base_value: 1,
      unit: 'aubergine',
      product_id: '821996',
    },

    {
      name: 'Village Bakery Super Soft Original Wraps 8 Pack',
      price_per_unit: 0.85,
      category_id: 2,
      supermarket_id: 1,
      base_value: 8,
      unit: 'roll',
      product_id: '4088600111827',
    },

    {
      name: "Nature's Pick Courgettes 500g",
      price_per_unit: 1.15,
      category_id: 3,
      supermarket_id: 3,
      base_value: 500,
      unit: 'gram',
      product_id: '4088600184951',
    },

    {
      name: "Nature's Pick Mixed Sweet Pepper 3 Pack",
      price_per_unit: 1.5,
      category_id: 3,
      supermarket_id: 3,
      base_value: 3,
      unit: 'pepper',
      product_id: '4088600084398',
    },

    {
      name: "Nature's Pick Red Chillies 65g",
      price_per_unit: 0.5,
      category_id: 3,
      supermarket_id: 1,
      base_value: 65,
      unit: 'gram',
      product_id: '4088600469751',
    },

    {
      name: 'Specially Selected Basil & Oregano Passata 700g',
      price_per_unit: 1.35,
      category_id: 3,
      supermarket_id: 1,
      base_value: 700,
      unit: 'gram',
      product_id: '4088600255057',
    },

    {
      name: 'Solesta Extra Virgin Olive Oil 750ml',
      price_per_unit: 2.85,
      category_id: 14,
      supermarket_id: 1,
      base_value: 750,
      unit: 'milliliter',
      product_id: '4088600307800',
    },

    {
      name: 'The Deli Pitted Black Olives 340g (165g Drained)',
      price_per_unit: 0.65,
      category_id: 3,
      supermarket_id: 1,
      base_value: 340,
      unit: 'gram',
      product_id: '4088600174303',
    },

    {
      name: 'The Deli Sour Cream & Chive Dip 200g',
      price_per_unit: 0.79,
      category_id: 21,
      supermarket_id: 1,
      base_value: 200,
      unit: 'gram',
      product_id: '4088600005201',
    },

    {
      name: "Nature's Pick Limes 5 Pack",
      price_per_unit: 0.85,
      category_id: 3,
      supermarket_id: 2,
      base_value: 5,
      unit: 'lime',
      product_id: '4088600187693',
    },

    {
      name: 'Foodie Market Pine Nuts 60g',
      price_per_unit: 1.49,
      category_id: 13,
      supermarket_id: 1,
      base_value: 60,
      unit: 'gram',
      product_id: '4088600268811',
    },

    {
      name: 'Cucina Penne 500g',
      price_per_unit: 0.75,
      category_id: 22,
      supermarket_id: 2,
      base_value: 500,
      unit: 'gram',
      product_id: '4088600103723',
    },

    {
      name: 'Foodie Market Sunflower Seeds 250g',
      price_per_unit: 1.25,
      category_id: 13,
      supermarket_id: 1,
      base_value: 250,
      unit: 'gram',
      product_id: '4088600268774',
    },

    {
      name: "Nature's Pick Garlic 4 Pack",
      price_per_unit: 0.79,
      category_id: 3,
      supermarket_id: 1,
      base_value: 4,
      unit: 'garlic',
      product_id: '4088600185071',
    },

    {
      name: "Nature's Pick Cut Basil 30g",
      price_per_unit: 0.52,
      category_id: 3,
      supermarket_id: 1,
      base_value: 30,
      unit: 'gram',
      product_id: '4088600028101',
    },

    {
      name: 'Everyday Essentials Lemons 4 Pack',
      price_per_unit: 0.5,
      category_id: 3,
      supermarket_id: 1,
      base_value: 4,
      unit: 'lemon',
      product_id: '4088600081250',
    },

    {
      name: "Nature's Pick Onions 1kg",
      price_per_unit: 0.49,
      category_id: 3,
      supermarket_id: 3,
      base_value: 1,
      unit: 'kilogram',
      product_id: '4088600185118',
    },

    {
      name: 'Four Seasons British Garden Peas 900g',
      price_per_unit: 0.65,
      category_id: 3,
      supermarket_id: 1,
      base_value: 900,
      unit: 'gram',
      product_id: '4088600221267',
    },

    {
      name: "Nature's Pick Shredded Kale 200g",
      price_per_unit: 0.75,
      category_id: 3,
      supermarket_id: 2,
      base_value: 200,
      unit: 'gram',
      product_id: '4088600421599',
    },

    {
      name: "Nature's Pick The Salad Box Baby Spinach 240g",
      price_per_unit: 0.76,
      category_id: 3,
      supermarket_id: 1,
      base_value: 240,
      unit: 'gram',
      product_id: '4088600009575',
    },

    {
      name: "Nature's Pick Asparagus Tips 100g",
      price_per_unit: 1.39,
      category_id: 3,
      supermarket_id: 1,
      base_value: 100,
      unit: 'gram',
      product_id: '4088600123622',
    },

    {
      name: 'Foodie Market Seed Mix 250g',
      price_per_unit: 1.25,
      category_id: 13,
      supermarket_id: 2,
      base_value: 250,
      unit: 'gram',
      product_id: '4088600268781',
    },

    {
      name: 'The Fishmonger Smoked Haddock Fillets 230g/2 Pack',
      price_per_unit: 3.29,
      category_id: 4,
      supermarket_id: 1,
      base_value: 230,
      unit: 'gram',
      product_id: '4088600457581',
    },

    {
      name: 'The Fishmonger Boneless Salmon Fillets 240g/2 Pack',
      price_per_unit: 3.39,
      category_id: 4,
      supermarket_id: 1,
      base_value: 240,
      unit: 'gram',
      product_id: '4088600022239',
    },

    {
      name: 'The Fishmonger Cod Fillets 250g/2 Pack',
      price_per_unit: 3.29,
      category_id: 4,
      supermarket_id: 3,
      base_value: 250,
      unit: 'gram',
      product_id: '4088600317670',
    },

    {
      name: 'Ready, Set…Cook! Parsley 8g',
      price_per_unit: 0.44,
      category_id: 3,
      supermarket_id: 1,
      base_value: 8,
      unit: 'gram',
      product_id: '4088600373324',
    },

    {
      name: 'Cucina Creamy Lasagne Sauce 480g',
      price_per_unit: 0.75,
      category_id: 14,
      supermarket_id: 3,
      base_value: 480,
      unit: 'gram',
      product_id: '4088600304670',
    },

    {
      name: 'Cowbelle British Double Fresh Cream 300ml',
      price_per_unit: 1.09,
      category_id: 21,
      supermarket_id: 2,
      base_value: 300,
      unit: 'milliliter',
      product_id: '4088600032245',
    },

    {
      name: 'The Pantry Lemon Juice 250ml',
      price_per_unit: 0.39,
      category_id: 14,
      supermarket_id: 1,
      base_value: 250,
      unit: 'milliliter',
      product_id: '4088600099071',
    },

    {
      name: 'Everyday Essentials Potatoes 2.5kg',
      price_per_unit: 1.05,
      category_id: 3,
      supermarket_id: 2,
      base_value: 2.5,
      unit: 'kilogram',
      product_id: '4088600069852',
    },

    {
      name: 'Emporium British Extra Mature Cheddar Cheese 400g',
      price_per_unit: 2.65,
      category_id: 21,
      supermarket_id: 1,
      base_value: 400,
      unit: 'gram',
      product_id: '4088600048451',
    },

    {
      name: 'Four Seasons Supersweet Sweetcorn 1kg',
      price_per_unit: 1.25,
      category_id: 3,
      supermarket_id: 2,
      base_value: 1,
      unit: 'kilogram',
      product_id: '4088600032887',
    },
  ]);
}
