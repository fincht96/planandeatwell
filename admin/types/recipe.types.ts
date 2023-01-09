import { Ingredient } from './ingredient.types';

export interface Recipe {
  name: string;
  baseServings: number;
  pricePerServing: number;
  imagePath: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<Ingredient>;
}
