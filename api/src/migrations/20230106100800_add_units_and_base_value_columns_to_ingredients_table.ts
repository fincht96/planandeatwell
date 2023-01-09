import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.decimal('base_value', null).unsigned();
    table.string('unit');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.dropColumn('base_value');
    table.dropColumn('unit');
  });
}
