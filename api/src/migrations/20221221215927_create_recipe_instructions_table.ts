import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('recipe_instructions', function (table) {
    table.increments('id').primary();
    table.integer('step').unsigned().checkBetween([1, 20]);
    table.text('instruction');
    table
      .bigInteger('recipe_id')
      .references('id')
      .inTable('recipes')
      .unsigned()
      .index()
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipe_instructions');
}
