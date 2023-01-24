import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipe_metrics', (table) => {
    table.integer('recipe_id').unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('recipe_metrics', (table) => {
    table.integer('recipe_id').alter();
  });
}
