import { Knex } from 'knex';
import { orderByToIngredientColumn } from './orderByToIngredientColumn';

export const getIngredientsBaseQuery = (db: Knex) => {
  return db.select('*').from('ingredients');
};

export const matchingIngredientIds =
  ({ ingredientIds }: { ingredientIds: Array<number> }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    if (ingredientIds.length) {
      queryBuilder.where('ingredients.id', 'IN', [...ingredientIds]);
    }
    return queryBuilder;
  };

export const ingredientQueryOrdering =
  ({
    order,
    orderBy,
  }: {
    order: 'asc' | 'desc' | 'any';
    orderBy: 'relevance' | 'createdAt';
  }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    const col = orderByToIngredientColumn(orderBy);
    if (order.length && orderBy.length) {
      const colOrder = order === 'any' ? 'asc' : order;
      queryBuilder.orderBy(col, colOrder);
    }

    return queryBuilder;
  };

export const matchingSupermarketId =
  ({ supermarketId }: { supermarketId: number | null }) =>
  (queryBuilder: Knex.QueryBuilder) => {
    if (supermarketId) {
      queryBuilder.andWhere('ingredients.supermarket_id', supermarketId);
    }
    return queryBuilder;
  };
