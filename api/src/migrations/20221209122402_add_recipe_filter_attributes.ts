import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
        -- meal_type column
        CREATE TYPE MEAL AS ENUM ('breakfast','brunch', 'lunch', 'dinner', 'dessert', 'sides');
        ALTER TABLE recipes 
        ADD meal_type MEAL[];

        -- lifestyle_type column
        CREATE TYPE LIFESTYLE AS ENUM ('vegetarian','vegan', 'meat', 'pescatarian');
        ALTER TABLE recipes 
        ADD lifestyle_type LIFESTYLE[];

        -- free_from_type column
        CREATE TYPE FREE_FROM AS ENUM ('dairy_free','gluten_free');
        ALTER TABLE recipes 
        ADD free_from_type FREE_FROM[];
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
        ALTER TABLE recipes
        DROP COLUMN meal_type;
        DROP TYPE MEAL;

        ALTER TABLE recipes
        DROP COLUMN lifestyle_type;
        DROP TYPE LIFESTYLE;

        ALTER TABLE recipes
        DROP COLUMN free_from_type;
        DROP TYPE FREE_FROM;
    `);
}
