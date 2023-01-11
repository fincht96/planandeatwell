import camelize from 'camelize-ts';
import { Ingredient } from '../../types/ingredient.types';
import { Supermarket } from '../../types/supermarket.types';

export const insertIngredient = (token: string, ingredient: Ingredient) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

export const getIngredientsSearch = ({
  searchString,
  selectedSupermarket,
}: {
  searchString: string;
  selectedSupermarket?: Supermarket;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`);
  const params = new URLSearchParams({
    search: searchString,
    ...(selectedSupermarket?.id && {
      supermarketId: selectedSupermarket.id.toString(),
    }),
  });

  url.search = params.toString();

  return fetch(url).then(async (res) => {
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

export const deleteIngredient = (token: string, id: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/${id}`, {
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

export const updateIngredientPrices = (
  token: string,
  supermarketId: number,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/update-prices`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      supermarketId,
    }),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
