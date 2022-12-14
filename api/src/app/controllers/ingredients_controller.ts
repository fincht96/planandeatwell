import { Request, Response } from 'express';
import validator from 'validator';
import EventsService from '../services/events_service';
import IngredientsService from '../services/ingredients_service';
import Joi from 'joi';

const searchIngredientsSchema = Joi.object({
  search: Joi.string().max(100),
});

const insertIngredientSchema = Joi.object({
  name: Joi.string().max(200).required(),
  pricePerUnit: Joi.number().min(0).max(100).required(),
  productId: Joi.number().min(0).required(),
  categoryId: Joi.number().min(1).required(),
}).and('name', 'pricePerUnit', 'productId', 'categoryId');

const getIngredientsSchema = Joi.object({
  orderBy: Joi.string().valid('createdAt'),
  order: Joi.string().valid('asc', 'desc'),
}).and('orderBy', 'order');

const removeIngredientSchema = Joi.object({
  id: Joi.number().min(1).required(),
});

export default class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly eventsService: EventsService,
  ) {}

  async getIngredients(req: Request, res: Response) {
    try {
      // get ingredents for recipe
      if (req.query.recipeId) {
        // validate recipe id
        const recipeId: string = req.query.recipeId + '';
        if (!validator.isInt(recipeId)) {
          throw new Error('Invalid recipeId provided');
        }

        const result = await this.ingredientsService.getIngredientsFromRecipe(
          validator.toInt(recipeId),
        );

        return res.status(200).json({
          result,
          errors: [],
        });
      }

      // get ingredients that could match search
      else if (req.query.search) {
        // validate search
        const search: string = req.query.search + '';
        const { error, value } = searchIngredientsSchema.validate({
          search,
        });
        if (error) {
          throw new Error(error.message);
        }

        const result = await this.ingredientsService.searchIngredients(
          value.search.toLowerCase(),
        );

        return res.status(200).json({
          result,
          errors: [],
        });
      } else {
        const { error, value } = getIngredientsSchema.validate(req.query);

        if (error) {
          throw new Error(error.message);
        }

        const ingredients = await this.ingredientsService.getIngredients(value);

        return res.status(200).json({
          result: ingredients,
          errors: [],
        });
      }
    } catch (e: any) {
      await this.eventsService.insert('INGREDIENTS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async insertIngredient(req: Request, res: Response) {
    try {
      const { error, value } = insertIngredientSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.ingredientsService.insertIngredient(value);

      return res.status(200).json({
        result,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('INGREDIENTS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async removeIngredient(req: Request, res: Response) {
    try {
      const { error, value } = removeIngredientSchema.validate(req.params);

      if (error) {
        throw new Error(error.message);
      }

      // remove ingredient from db
      const removedIngredient = await this.ingredientsService.removeIngredient(
        value.id,
      );

      return res.status(200).json({
        result: removedIngredient,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('INGREDIENTS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
