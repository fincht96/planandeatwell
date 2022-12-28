import camelize from 'camelize-ts';

export const getMealPlan = (
  mealPlanUuid: string,
  includeAggregatedIngredients: boolean = false,
  includeIngredientsWithRecipes: boolean = false,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meal-plan/${mealPlanUuid}?includeAggregatedIngredients=${includeAggregatedIngredients}&includeIngredientsWithRecipes=${includeIngredientsWithRecipes}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const insertMealPlan = (recipeIdList: Array<number>) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal-plan`, {
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

export const updateMealPlan = (
  mealPlanUuid: string,
  newMealPlan: { recipeIdList?: Array<number>; name?: string },
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal-plan/${mealPlanUuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMealPlan),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
