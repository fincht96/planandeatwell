import { Ingredient as IngredientType } from './ingredient.types';
import { InstructionType } from './instruction.types';

export interface RecipeType {
  id?: number;
  name: string;
  baseServings: number;
  pricePerServing: number;
  imagePath: string;
  prepTime: number;
  cookTime: number;
  lifestyleType: string;
  freeFromType: string;
  instructions: Array<string>;
  supermarketName: string;
  createdAt: string;
  instructionsList: Array<InstructionType>;
  ingredientsList: Array<IngredientType>;
}
