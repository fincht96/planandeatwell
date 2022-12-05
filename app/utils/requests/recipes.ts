import camelize from 'camelize-ts';
// import snakeize from 'snakeize';

export const getRecipes = ({
  includeIngredients,
  offset,
  limit,
}: {
  includeIngredients: boolean;
  offset: number;
  limit: number;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  const params = new URLSearchParams({
    includeIngredients: includeIngredients.toString(),
    offset: offset.toString(),
    limit: limit.toString(),
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
    // return camelize(json.result);
  });
};
