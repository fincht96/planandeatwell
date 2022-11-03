import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('recipes', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('servings').notNullable();
    table.decimal('price_per_serving').notNullable();
    table.string('image_path').notNullable();
    table.string('link').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipes');
}
