import camelize from 'camelize-ts';

export const getMealPlans = ({
  token,
  userId,
  offset,
  limit,
  order,
  orderBy,
  searchTerm,
  includeCount,
  includeSupermarketDetails,
}: {
  token: string;
  userId: number;
  offset: number;
  limit: number;
  order?: string | undefined;
  orderBy?: string | undefined;
  searchTerm?: string | undefined;
  includeCount?: boolean | undefined;
  includeSupermarketDetails?: boolean | undefined;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/meal-plans`);
  const params = new URLSearchParams({
    userId: userId.toString(),
    offset: offset.toString(),
    limit: limit.toString(),
    ...(order && { order }),
    ...(orderBy && { orderBy }),
    ...(searchTerm && { searchTerm }),
    ...(includeCount && { includeCount: includeCount.toString() }),
    ...(includeSupermarketDetails && {
      includeSupermarketDetails: includeSupermarketDetails.toString(),
    }),
  });

  url.search = params.toString();

  return fetch(url, {
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

export const getMealPlan = ({
  mealPlanUuid,
  includeSupermarketDetails,
}: {
  mealPlanUuid: string;
  includeSupermarketDetails?: boolean | undefined;
}) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/meal-plan/${mealPlanUuid}`,
  );

  const params = new URLSearchParams({
    ...(includeSupermarketDetails && {
      includeSupermarketDetails: includeSupermarketDetails.toString(),
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

export const insertMealPlan = (
  token: string,
  mealPlan: {
    recipeIdList: Array<{ recipeId: number; servings: number }>;
    totalServings: number;
    totalPrice: number;
    ingredientsCount: number;
    recipesCount: number;
    supermarketId: string;
  },
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mealPlan),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const updateMealPlan = (
  token: string,
  mealPlanUuid: string,
  newMealPlan: {
    recipeIdList?: Array<{ recipeId: number; servings: number }>;
    name?: string;
    totalServings: number;
    totalPrice: number;
    ingredientsCount: number;
    recipesCount: number;
    supermarketId?: string | undefined;
  },
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal-plan/${mealPlanUuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newMealPlan),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const deleteMealPlan = (token: string, mealPlanUuid: string): any => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal-plan/${mealPlanUuid}`, {
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
