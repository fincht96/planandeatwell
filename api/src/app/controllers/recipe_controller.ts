import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import RecipeService from '../services/recipe_service';
import Joi from 'joi';
import StorageService from '../services/storage_service';
import AppConfig from '../configs/app.config';

const getRecipeListSchema = Joi.object({
  limit: Joi.number().min(1).max(100).required(),
  offset: Joi.number().min(0).required(),
  includeIngredientsWithRecipes: Joi.bool().required(),
  meals: Joi.array().items(
    Joi.string().valid(
      'breakfast',
      'brunch',
      'lunch',
      'dinner',
      'sides',
      'dessert',
    ),
  ),
  lifestyles: Joi.array().items(
    Joi.string().valid('vegetarian', 'vegan', 'meat', 'pescatarian'),
  ),
  freeFroms: Joi.array().items(Joi.string().valid('dairyFree', 'glutenFree')),
  order: Joi.string().valid('asc', 'desc', 'any'),
  orderBy: Joi.string().valid('relevance', 'price', 'createdAt'),
  searchTerm: Joi.string().min(2).max(200),
  recipeIds: Joi.array().items(Joi.number()),
})
  .and('limit', 'offset')
  .and('order', 'orderBy');

const insertRecipeSchema = Joi.object({
  name: Joi.string().max(200).required(),
  servings: Joi.number().max(40).required(),
  pricePerServing: Joi.number().min(0).max(20).required(),
  imagePath: Joi.string().max(400).required(),
  link: Joi.string().max(400).required(),
  instructions: Joi.array().items(Joi.string()).required().min(1).messages({
    'array.min': 'Instructions cannot be empty',
  }),
  cookTime: Joi.number().min(1).max(120).required(),
  prepTime: Joi.number().min(1).max(120).required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().min(1),
        unitQuantity: Joi.number().min(0).max(20).required(),
      }),
    )
    .min(1),
  meals: Joi.array()
    .items(
      Joi.string().valid(
        'breakfast',
        'brunch',
        'lunch',
        'dinner',
        'sides',
        'dessert',
      ),
    )
    .required(),
  lifestyles: Joi.array().items(
    Joi.string().valid('vegetarian', 'vegan', 'meat', 'pescatarian'),
  ),
  freeFroms: Joi.array().items(Joi.string().valid('dairyFree', 'glutenFree')),
}).and(
  'name',
  'servings',
  'pricePerServing',
  'imagePath',
  'link',
  'ingredients',
  'meals',
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
      let meals: Array<string> = [];
      let lifestyles: Array<string> = [];
      let freeFroms: Array<string> = [];
      let recipeIds: Array<number> = [];

      if (req.query?.recipeIds) {
        recipeIds = `${req.query.recipeIds}`
          .split(',')
          .map((recipeId) => parseInt(recipeId));
      }

      if (req.query?.meals) {
        meals = `${req.query.meals}`.split(',');
      }

      if (req.query?.lifestyles) {
        lifestyles = `${req.query.lifestyles}`.split(',');
      }

      if (req.query?.freeFroms) {
        freeFroms = `${req.query.freeFroms}`.split(',');
      }

      const { error, value } = getRecipeListSchema.validate({
        ...req.query,
        meals,
        lifestyles,
        freeFroms,
        recipeIds,
      });

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.recipeService.get(value);
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
