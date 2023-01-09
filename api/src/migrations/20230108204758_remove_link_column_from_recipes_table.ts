import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipes', (table) => {
    table.dropColumn('link');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipes', (table) => {
    table.string('link').notNullable();
  });
}
