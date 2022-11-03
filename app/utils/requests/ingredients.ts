import camelize from 'camelize-ts';

export const getIngredients = (recipeId?: number) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ingredients?recipeId=${recipeId}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
