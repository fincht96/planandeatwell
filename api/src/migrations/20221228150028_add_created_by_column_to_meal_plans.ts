import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plans', (table) => {
    table.bigInteger('created_by').unsigned();
    table
      .foreign('created_by')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meal_plans', (table) => {
    table.dropColumn('created_by');
  });
}
