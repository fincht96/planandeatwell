import { Knex } from 'knex';
import { orderByToMealPlanColumn } from './orderByToMealPlanColumn';

export const getMealPlansBaseQuery = (db: Knex) => {
  return db('meal_plans').select('name', 'uuid', 'created_at', 'created_by');
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
