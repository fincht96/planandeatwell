import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('ingredients', (table) => {
    table.dropColumn('updated_at');
  });
}
