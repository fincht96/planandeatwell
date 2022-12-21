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
  recipeIds,
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
  recipeIds?: Array<number> | undefined;
}) => {
  let baseUrl;

  // if server-side request then run use the docker bridge url
  if (!(typeof window != 'undefined' && window.document)) {
    baseUrl = `${process.env.NEXT_PUBLIC_API_URL_DOCKER_SERVICE}`;
  } else {
    baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
  }

  const url = new URL(`${baseUrl}/recipes`);

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
    ...(recipeIds && { recipeIds: recipeIds.toString() }),
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
