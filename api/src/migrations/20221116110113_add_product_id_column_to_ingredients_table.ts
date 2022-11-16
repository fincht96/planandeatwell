import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.bigInteger('product_id').unique().unsigned();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.dropColumn('product_id');
  });
}
