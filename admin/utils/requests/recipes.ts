import camelize from 'camelize-ts';

import { RecipeWithIngredients } from '../../types/recipe.types';

export const insertRecipe = (recipeWithIngredients: RecipeWithIngredients) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

export const deleteRecipe = (id: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`, {
    method: 'DELETE',
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

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
