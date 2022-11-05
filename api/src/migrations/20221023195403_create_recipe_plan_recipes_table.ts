import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('recipe_plan_recipes', function (table) {
    table.increments('id').primary();
    table.integer('recipe_plan_id').unsigned();
    table
      .foreign('recipe_plan_id')
      .references('recipe_plans.id')
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
  return knex.schema.dropTable('recipe_plan_recipes');
}
