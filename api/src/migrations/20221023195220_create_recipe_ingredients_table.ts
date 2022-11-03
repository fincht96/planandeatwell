import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('recipe_ingredients', function (table) {
    table.increments('id').primary();
    table.integer('recipe_id').unsigned();
    table
      .foreign('recipe_id')
      .references('recipes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('ingredient_id').unsigned();
    table
      .foreign('ingredient_id')
      .references('ingredients.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.decimal('unit_quantity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipes');
}
