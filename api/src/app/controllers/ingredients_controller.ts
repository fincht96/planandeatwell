import { Request, Response } from 'express';
import validator from 'validator';
import EventsService from '../services/events_service';
import IngredientsService from '../services/ingredients_service';
import Joi from 'joi';

const searchIngredientsSchema = Joi.object({
  search: Joi.string().max(100),
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

        const { result, error } =
          await this.ingredientsService.getIngredientsFromRecipe(
            validator.toInt(recipeId),
          );

        if (error) {
          throw new Error(`Unable to get ingredients for recipe: ${recipeId}`);
        }

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

        const { result, error: searchIngredientsError } =
          await this.ingredientsService.searchIngredients(search.toLowerCase());

        if (searchIngredientsError) {
          throw new Error(`Unable to search ingredients`);
        }

        return res.status(200).json({
          result,
          errors: [],
        });
      } else {
        throw new Error('Invalid query params provided');
      }
    } catch (e: any) {
      await this.eventsService.insert('INGREDIENTS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
