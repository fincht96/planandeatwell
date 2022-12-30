import { Order, OrderBy, SortBy } from '../types/mealPlanOrder.types';

export function sortByToOrder(sortBy: SortBy): {
  order: Order;
  orderBy: OrderBy;
} {
  switch (sortBy) {
    default:
    case 'relevance': {
      return {
        order: 'any',
        orderBy: 'relevance',
      };
    }
    case 'newest': {
      return {
        order: 'desc',
        orderBy: 'createdAt',
      };
    }
  }
}

export function orderToSortBy(order: Order, orderBy: OrderBy) {
  const orderMap = new Map<string, SortBy>();

  orderMap.set(
    JSON.stringify({ order: 'any', orderBy: 'relevance' }),
    'relevance',
  );
  orderMap.set(
    JSON.stringify({ order: 'desc', orderBy: 'createdAt' }),
    'newest',
  );

  const sortBy = orderMap.get(JSON.stringify({ order, orderBy }));

  return sortBy ?? 'relevance';
}
