import { Request, Response } from 'express';
import validator from 'validator';
import EventsService from '../services/events_service';
import IngredientsService from '../services/ingredients_service';

export default class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly eventsService: EventsService,
  ) {}

  async getIngredients(req: Request, res: Response) {
    try {
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
    } catch (e: any) {
      await this.eventsService.insert('INGREDIENTS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
