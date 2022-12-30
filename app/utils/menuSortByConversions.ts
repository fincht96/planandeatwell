import { Order, OrderBy, SortBy } from '../types/menuOrder.types';

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

    case 'priceAscending': {
      return {
        order: 'asc',
        orderBy: 'price',
      };
    }

    case 'priceDescending': {
      return {
        order: 'desc',
        orderBy: 'price',
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
    JSON.stringify({ order: 'asc', orderBy: 'price' }),
    'priceAscending',
  );
  orderMap.set(
    JSON.stringify({ order: 'desc', orderBy: 'price' }),
    'priceDescending',
  );
  orderMap.set(
    JSON.stringify({ order: 'desc', orderBy: 'createdAt' }),
    'newest',
  );

  const sortBy = orderMap.get(JSON.stringify({ order, orderBy }));

  return sortBy ?? 'relevance';
}
