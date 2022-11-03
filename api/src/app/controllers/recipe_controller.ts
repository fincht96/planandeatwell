import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import RecipeService from '../services/recipe_service';
import validator from 'validator';

export default class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly eventsService: EventsService,
  ) {}

  async getRecipeList(req: Request, res: Response) {
    try {
      const includeIngredients: string = req.query.includeIngredients + '';

      if (
        req.query?.includeIngredients &&
        !validator.isBoolean(includeIngredients)
      ) {
        throw new Error('Invalid argument provided');
      }

      const result = await this.recipeService.getAll(
        req.query?.includeIngredients
          ? validator.toBoolean(includeIngredients)
          : false,
      );

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
}
