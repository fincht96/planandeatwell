import camelize from 'camelize-ts';

import { RecipeWithIngredients } from '../../types/recipe.types';

export const insertRecipe = (
  token: string,
  recipeWithIngredients: RecipeWithIngredients,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeWithIngredients),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const deleteRecipe = (token: string, id: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const getRecipes = ({
  includeIngredientsWithRecipes,
  offset,
  limit,
  meals,
  lifestyles,
  freeFroms,
}: {
  includeIngredientsWithRecipes: boolean;
  offset: number;
  limit: number;
  meals?: string | undefined;
  lifestyles?: string | undefined;
  freeFroms?: string | undefined;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  const params = new URLSearchParams({
    includeIngredientsWithRecipes: includeIngredientsWithRecipes.toString(),
    offset: offset.toString(),
    limit: limit.toString(),
    ...(meals && { meals }),
    ...(lifestyles && { lifestyles }),
    ...(freeFroms && { freeFroms }),
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
