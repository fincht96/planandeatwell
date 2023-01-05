import { roundTo2dp } from './roundTo2dp';

export const scaleIngredientQuantities = (
  ingredients: Array<any>,
  baseServings: number,
  newServings: number,
) => {
  const factor = (newServings / baseServings) * 1.0;

  return ingredients.map((ingredient) => {
    return {
      ...ingredient,
      unitQuantity: ingredient.unitQuantity * factor,
    };
  });
};

export const calcTotalIngredientsPrice = (ingredients: Array<any>) => {
  return ingredients.reduce((total, currentIngredient) => {
    return (
      total +
      Math.ceil(currentIngredient.unitQuantity) * currentIngredient.pricePerUnit
    );
  }, 0);
};

export const roundUpQuantities = (ingredients: Array<any>) => {
  return ingredients.map((ingredient) => {
    const unitQuantity = Math.ceil(ingredient.unitQuantity);
    const price = roundTo2dp(ingredient.pricePerUnit * unitQuantity);

    return {
      ...ingredient,
      unitQuantity,
      price,
    };
  });
};
