import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.string('product_id').unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.dropColumn('product_id');
  });
}
