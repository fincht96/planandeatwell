import { RecipeType } from './recipe.types';

export interface MealPlanType {
  createdBy: number;
  id: number;
  name: string;
  recipes: Array<RecipeType>;
  uuid: string;
}

export interface MealPlanWithSupermarketDetailsType extends MealPlanType {
  supermarketDescription: string;
  supermarketId: number;
  supermarketName: string;
}
