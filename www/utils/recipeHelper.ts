import { roundTo2dp } from './roundTo2dp';

export const getFormattedQuanityAndUnitText = (
  preciseQuantity: number,
  unitOfMeasurement: string,
) => {
  const conventionalUnits: { [key: string]: string } = {
    gram: 'g',
    kilogram: 'kg',
    milliliter: 'ml',
    liter: 'l',
  };

  const isTraditional = !!Object.keys(conventionalUnits).find(
    (unit) => unit === unitOfMeasurement,
  );

  if (isTraditional) {
    return `(${preciseQuantity}` + `${conventionalUnits[unitOfMeasurement]})`;
  } else {
    return `(${preciseQuantity}` + ' ' + `${unitOfMeasurement})`;
  }
};

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

export const addPreciseQuantity = (ingredients: Array<any>) => {
  return ingredients.map((ingredient) => {
    return {
      ...ingredient,
      preciseQuantity: ingredient.baseValue * ingredient.unitQuantity,
    };
  });
};
