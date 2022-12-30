import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipes', (table) => {
    table.integer('prep_time').checkBetween([1, 120]).nullable().unsigned();
    table.integer('cook_time').checkBetween([1, 120]).nullable().unsigned();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipes', (table) => {
    table.dropColumn('prep_time');
    table.dropColumn('cook_time');
  });
}
