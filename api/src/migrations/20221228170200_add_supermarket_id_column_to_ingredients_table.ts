import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', (table) => {
    table
      .bigInteger('supermarket_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('supermarkets')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('ingredients', (table) => {
    table.dropColumn('supermarket_id');
  });
}
