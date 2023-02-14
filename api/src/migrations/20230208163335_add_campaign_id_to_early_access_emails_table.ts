import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('early_access_emails', (table) => {
    table.integer('campaignId').unsigned().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('early_access_emails', (table) => {
    table.dropColumn('campaignId');
  });
}
