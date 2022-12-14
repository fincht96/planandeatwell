export const calcPricePerServing = (
  ingredients: Array<{ unitQuantity: number; pricePerUnit: number }>,
  servings: number,
) => {
  const totalPrice = ingredients.reduce(
    (prev: number, current: { unitQuantity: number; pricePerUnit: number }) => {
      return current.pricePerUnit * current.unitQuantity + prev;
    },
    0,
  );
  return totalPrice / servings;
};
