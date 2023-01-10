import { Knex } from 'knex';
import { orderByToMealPlanColumn } from './orderByToMealPlanColumn';

export const getMealPlanQuery = (
  db: Knex,
  includeSupermarketDetails: boolean | undefined,
) => {
  const rawQuery = db.raw(`
    (
      select
        meal_plans.id,
        meal_plans.uuid,
        meal_plans.name,
        meal_plans.supermarket_id,
        CAST(meal_plans.supermarket_id as INTEGER) as supermarket_id,
        CAST(meal_plans.created_by as INTEGER) as created_by,
        supermarkets.name as supermarket_name,
        supermarkets.description as supermarket_description
      from
        meal_plans
        inner join supermarkets on supermarkets.id = meal_plans.supermarket_id
    ) as meal_plans
    `);

  if (includeSupermarketDetails) {
    return db.select('*').from(rawQuery);
  } else {
    return db('meal_plans').select(
      db.raw('id, created_at, created_by::INTEGER, name, uuid'),
    );
  }
};

export const getMealPlansBaseQuery = (
  db: Knex,
  includeSupermarketDetails: boolean | undefined,
) => {
  if (includeSupermarketDetails) {
    return db
      .select(
        'supermarkets.name as supermarket_name',
        'supermarkets.description as supermarket_description',
        'meal_plans.*',
        'meal_plan_metrics.recipes_count',
        'meal_plan_metrics.ingredients_count',
        'meal_plan_metrics.total_servings',
        'meal_plan_metrics.total_price',
      )
      .from('meal_plans')
      .join(
        'meal_plan_metrics',
        'meal_plan_metrics.meal_plan_id',
        'meal_plans.id',
      )
      .join('supermarkets', 'supermarkets.id', 'meal_plans.supermarket_id');
  } else {
    return db
      .select(
        'meal_plans.*',
        'meal_plan_metrics.recipes_count',
        'meal_plan_metrics.ingredients_count',
        'meal_plan_metrics.total_servings',
        'meal_plan_metrics.total_price',
      )
      .from('meal_plans')
      .join(
        'meal_plan_metrics',
        'meal_plan_metrics.meal_plan_id',
        'meal_plans.id',
      );
  }
};

export const matchingCreatedByQuery =
  ({ userIds }: { userIds: Array<number> }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    if (userIds.length) {
      queryBuilder.where('meal_plans.created_by', 'IN', [...userIds]);
    }
    return queryBuilder;
  };

export const mealPlanQuerySearch =
  ({ searchTerm }: { searchTerm: string }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    if (searchTerm.length) {
      queryBuilder.whereRaw(`name ILIKE ?`, [`%${searchTerm}%`]);
    }
    return queryBuilder;
  };

export const mealPlanQueryOrdering =
  ({
    order,
    orderBy,
  }: {
    order: 'asc' | 'desc' | 'any';
    orderBy: 'relevance' | 'createdAt';
  }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    const col = orderByToMealPlanColumn(orderBy);
    if (order.length && orderBy.length) {
      const colOrder = order === 'any' ? 'asc' : order;
      queryBuilder.orderBy(col, colOrder);
    }

    return queryBuilder;
  };
