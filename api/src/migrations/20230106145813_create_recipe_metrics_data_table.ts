import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('recipe_metrics', function (table) {
    table.increments('id').primary();
    table
      .integer('recipe_id')
      .references('id')
      .inTable('recipes')
      .unsigned()
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('ingredients_count').unsigned();
    table.float('price_per_serving').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipe_metrics');
}
