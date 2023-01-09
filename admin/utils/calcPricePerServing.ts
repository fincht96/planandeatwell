export const calcPricePerServing = (
  ingredients: Array<{ unitQuantity: number; pricePerUnit: number }>,
  servings: number,
) => {
  // ingredient quantities are rounded to whole integer values
  const totalPrice = ingredients.reduce(
    (prev: number, current: { unitQuantity: number; pricePerUnit: number }) => {
      return current.pricePerUnit * Math.ceil(current.unitQuantity) + prev;
    },
    0,
  );
  return totalPrice / servings;
};
