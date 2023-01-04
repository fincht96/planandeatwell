import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plan_recipes', (table) => {
    table.integer('servings');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plan_recipes', (table) => {
    table.dropColumn('servings');
  });
}
