import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', (table) => {
    table
      .bigInteger('category_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('categories')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', (table) => {
    table.dropColumn('category_id');
  });
}
