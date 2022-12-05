import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import RecipeService from '../services/recipe_service';
import Joi from 'joi';
import StorageService from '../services/storage_service';
import AppConfig from '../configs/app.config';

const getRecipeListSchema = Joi.object({
  limit: Joi.number().min(1).max(100).required(),
  offset: Joi.number().min(0).required(),
  includeIngredients: Joi.bool().required(),
}).and('limit', 'offset');

const insertRecipeSchema = Joi.object({
  name: Joi.string().max(200).required(),
  servings: Joi.number().max(40).required(),
  pricePerServing: Joi.number().min(0).max(20).required(),
  imagePath: Joi.string().max(400).required(),
  link: Joi.string().max(400).required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().min(1),
        unitQuantity: Joi.number().min(0).max(20).required(),
      }),
    )
    .min(1),
}).and(
  'name',
  'servings',
  'pricePerServing',
  'imagePath',
  'link',
  'ingredients',
);

const removeRecipeSchema = Joi.object({
  id: Joi.number().min(1).required(),
});

export default class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly eventsService: EventsService,
    private readonly storageService: StorageService,
    private readonly appConfig: AppConfig,
  ) {}

  async getRecipeList(req: Request, res: Response) {
    try {
      const { error, value } = getRecipeListSchema.validate(req.query);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.recipeService.getAll(value);
      res.setHeader('x-total-count', result.count);

      return res.status(200).json({
        result: result.recipes,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('RECIPES', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async insertRecipe(req: Request, res: Response) {
    try {
      const { error, value } = insertRecipeSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.recipeService.insertRecipe(value);

      return res.status(200).json({
        result,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('RECIPES', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async removeRecipe(req: Request, res: Response) {
    try {
      const { error, value } = removeRecipeSchema.validate(req.params);

      if (error) {
        throw new Error(error.message);
      }

      // remove recipe from db
      const removedRecipe = await this.recipeService.removeRecipe(value.id);

      // remove static image associated with recipe
      const objectKey = removedRecipe.imagePath.slice(1);
      await this.storageService.deleteFile(objectKey);

      return res.status(200).json({
        result: removedRecipe,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('RECIPES', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
