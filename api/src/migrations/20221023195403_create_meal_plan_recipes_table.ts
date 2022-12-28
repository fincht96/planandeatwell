import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meal_plan_recipes', function (table) {
    table.increments('id').primary();
    table.integer('meal_plan_id').unsigned();
    table
      .foreign('meal_plan_id')
      .references('meal_plans.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('recipe_id').unsigned();
    table
      .foreign('recipe_id')
      .references('recipes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meal_plan_recipes');
}
