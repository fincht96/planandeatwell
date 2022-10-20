import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', function (table) {
    table.increments('id').primary();
    table.string('event_type');
    table.string('event_name');
    table.string('event_message');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('events');
}
