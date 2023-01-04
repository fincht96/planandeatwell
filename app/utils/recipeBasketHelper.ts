import { roundTo2dp } from './roundTo2dp';

export const addRecipeServings = (
  recipeBasket: Array<any>,
  recipeToAdd: { recipe: any; servings: number },
) => {
  const existingRecipe = recipeBasket.find(
    (recipeInBasket) => recipeInBasket.recipe.id === recipeToAdd.recipe.id,
  );

  // if no existing ingredient found simply append
  if (!existingRecipe) {
    return [...recipeBasket, recipeToAdd];
  }

  // remove recipe found from basket
  const newRecipeBasket = recipeBasket.filter(
    (recipeInBasket) => recipeInBasket.recipe.id !== recipeToAdd.recipe.id,
  );

  // else append to existing recipe in basket
  const updatedRecipe = {
    ...existingRecipe,
    servings: existingRecipe.servings + recipeToAdd.servings,
  };

  return [...newRecipeBasket, updatedRecipe];
};

export const removeRecipeServings = (
  recipeBasket: Array<any>,
  recipeToRemove: { recipe: any; servings: number },
) => {
  const existingRecipe = recipeBasket.find(
    (recipeInBasket) => recipeInBasket.recipe.id === recipeToRemove.recipe.id,
  );

  // if no recipe found in basket
  if (!existingRecipe) {
    return recipeBasket;
  }

  // remove recipe found from basket
  const newRecipeBasket = recipeBasket.filter(
    (recipeInBasket) => recipeInBasket.recipe.id !== recipeToRemove.recipe.id,
  );

  const updatedRecipe = {
    ...existingRecipe,
    servings: (existingRecipe.servings -= recipeToRemove.servings),
  };

  // if recipe has no servings, remove from recipe basket
  if (updatedRecipe.servings < 1) {
    return newRecipeBasket;
  }

  // overwrite recipe in basket with new servings
  return [...newRecipeBasket, updatedRecipe];
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

export const addIngredients = (
  ingredientsBasket: Array<any>,
  ingredientsToAdd: Array<any>,
) => {
  return ingredientsToAdd.reduce((newIngredientsBasket, ingredientToAdd) => {
    const existingIngredient = newIngredientsBasket.find(
      (ingredient) => ingredient.id === ingredientToAdd.id,
    );

    // if no existing ingredient found simply append
    if (!existingIngredient) {
      return [...newIngredientsBasket, { ...ingredientToAdd }];
    }

    // update existing ingredient
    else {
      const updatedIngredient = {
        ...existingIngredient,
        unitQuantity:
          existingIngredient.unitQuantity + ingredientToAdd.unitQuantity,
      };

      return newIngredientsBasket.map((ingredient) => {
        if (updatedIngredient.id === ingredient.id) {
          return updatedIngredient;
        }
        return ingredient;
      });
    }
  }, ingredientsBasket);
};

export const removeIngredients = (
  ingredientsBasket: Array<any>,
  ingredientsToRemove: Array<any>,
) => {
  // subtract ingredients from ingredients basket
  return ingredientsBasket.reduce((newIngredientsBasket, basketIngredient) => {
    const ingredientToRemove = ingredientsToRemove.find(
      (ingredient) => ingredient.id === basketIngredient.id,
    );

    if (ingredientToRemove) {
      const updatedIngredient = {
        ...basketIngredient,
        unitQuantity:
          basketIngredient.unitQuantity - ingredientToRemove.unitQuantity,
      };

      // if quantity < 0, don't include ingredient in new ingredients basket
      return updatedIngredient.unitQuantity <= 0.0001
        ? newIngredientsBasket
        : [...newIngredientsBasket, updatedIngredient];
    }

    // ingredient is unaffected
    return [...newIngredientsBasket, { ...basketIngredient }];
  }, []);
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
