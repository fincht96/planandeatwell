import { Ingredient } from './ingredient.types';

export interface Recipe {
  id?: number;
  name: string;
  servings: number;
  pricePerServing: number;
  imagePath: string;
  link: string;
  prepTime: number;
  cookTime: number;
  meals: Array<
    'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'sides' | 'dessert'
  >;
  lifestyles: Array<'vegetarian' | 'vegan' | 'meat' | 'pescatarian'>;
  freeFroms: Array<'dairyFree' | 'glutenFree'>;
  instructions: Array<string>;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<Ingredient>;
}
