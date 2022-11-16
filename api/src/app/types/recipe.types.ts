import { Ingredient } from './ingredient.types';

export interface Recipe {
  id?: number;
  name: string;
  servings: number;
  pricePerServing: number;
  imagePath: string;
  link: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<Ingredient>;
}
