import camelize from 'camelize-ts';
import { Ingredient } from '../../types/ingredient.types';

export const insertIngredient = (ingredient: Ingredient) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredient),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const getIngredientsSearch = (searchString: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ingredients?search=${searchString}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const getIngredients = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ingredients?orderBy=createdAt&order=desc`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const deleteIngredient = (id: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/${id}`, {
    method: 'DELETE',
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
