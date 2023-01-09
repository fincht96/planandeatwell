export function orderByToIngredientColumn(orderBy: 'relevance' | 'createdAt') {
  switch (orderBy) {
    case 'createdAt':
      return 'created_at';
    default:
    case 'relevance':
      return 'name';
  }
}
