import { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('emails', function (table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('emails');
}
