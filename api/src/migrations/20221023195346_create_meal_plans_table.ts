import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meal_plans', function (table) {
    table.increments('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw(`gen_random_uuid ()`));
    table.string('name').defaultTo('Untitled Meal Plan');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meal_plans');
}
