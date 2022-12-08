import camelize from 'camelize-ts';

export const getRecipes = ({
  includeIngredientsWithRecipes,
  offset,
  limit,
}: {
  includeIngredientsWithRecipes: boolean;
  offset: number;
  limit: number;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  const params = new URLSearchParams({
    includeIngredientsWithRecipes: includeIngredientsWithRecipes.toString(),
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
  });
};
