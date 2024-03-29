import camelize from 'camelize-ts';

/*
Consider implementing builder pattern to make more readable
e.g. 
Requests
.getRecipes()
.includeIngredients(true)
.offset(10)
.limit(10)
.mealTypes(mealTypes);

*/
export const getRecipes = ({
  includeIngredientsWithRecipes,
  offset,
  limit,
  meals,
  lifestyles,
  freeFroms,
  order,
  orderBy,
  searchTerm,
  supermarketId,
}: {
  includeIngredientsWithRecipes: boolean;
  offset: number;
  limit: number;
  meals?: string | undefined;
  lifestyles?: string | undefined;
  freeFroms?: string | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  searchTerm?: string | undefined;
  supermarketId?: string | undefined;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  const params = new URLSearchParams({
    includeIngredientsWithRecipes: includeIngredientsWithRecipes.toString(),
    offset: offset.toString(),
    limit: limit.toString(),
    ...(meals && { meals }),
    ...(lifestyles && { lifestyles }),
    ...(freeFroms && { freeFroms }),
    ...(order && { order }),
    ...(orderBy && { orderBy }),
    ...(searchTerm && { searchTerm }),
    ...(supermarketId && { supermarketId }),
  });

  url.search = params.toString();

  return fetch(url).then(async (res) => {
    const totalCount = res.headers.get('X-Total-Count');
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }

    return {
      recipes: camelize(json.result),
      totalCount: parseInt(totalCount ?? '0'),
    };
  });
};
