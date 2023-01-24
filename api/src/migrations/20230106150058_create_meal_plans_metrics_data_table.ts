import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meal_plan_metrics', function (table) {
    table.increments('id').primary();
    table
      .integer('meal_plan_id')
      .references('id')
      .inTable('meal_plans')
      .unsigned()
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('recipes_count').unsigned();
    table.integer('ingredients_count').unsigned();
    table.integer('total_servings').unsigned();
    table.float('total_price').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meal_plan_metrics');
}
