import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plan_metrics', (table) => {
    table.integer('meal_plan_id').unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plan_metrics', (table) => {
    table.integer('meal_plan_id').alter();
  });
}
