import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table
      .string('uid')
      .unique()
      .nullable()
      .defaultTo(knex.raw(`gen_random_uuid ()`));
    table.specificType('roles', 'VARCHAR(200)[]');
    table.string('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
