import camelize from 'camelize-ts';
// import snakeize from 'snakeize';

export const getRecipes = (includeIngredients: boolean) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipes?includeIngredients=${includeIngredients}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
