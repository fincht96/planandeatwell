import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('early_access_emails', function (table) {
    table.increments('id').primary();
    table.string('email').unique();
    table.boolean('haveSentSignUpLink').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('early_access_emails');
}
