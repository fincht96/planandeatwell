import camelize from 'camelize-ts';

export const getRecipePlan = (
  recipePlanUuid: string,
  includeIngredients: boolean = false,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipe-plan/${recipePlanUuid}?includeIngredients=${includeIngredients}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const insertRecipePlan = (recipeIdList: Array<number>) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeIdList }),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const updateRecipePlan = (
  recipePlanUuid: string,
  newRecipePlan: { recipeIdList?: Array<number>; name?: string },
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipe-plan/${recipePlanUuid}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipePlan),
    },
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
