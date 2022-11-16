import { Ingredient } from './ingredient.types';

export interface Recipe {
  name: string;
  servings: number;
  pricePerServing: number;
  imagePath: string;
  link: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<Ingredient>;
}
