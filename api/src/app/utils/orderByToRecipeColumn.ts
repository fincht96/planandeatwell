export function orderByToRecipeColumn(
  orderBy: 'relevance' | 'price' | 'createdAt',
) {
  switch (orderBy) {
    case 'price':
      return 'price_per_serving';
    case 'createdAt':
      return 'created_at';
    default:
    case 'relevance':
      return 'name';
  }
}
