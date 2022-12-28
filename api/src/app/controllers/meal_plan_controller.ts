import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import MealPlanService from '../services/meal_plan_service';
import validator from 'validator';
import Joi from 'joi';

const insertMealPlanSchema = Joi.object({
  recipeIdList: Joi.array().items(Joi.number()).required(),
});

const updateMealPlanSchema = Joi.object({
  name: Joi.string().max(200),
  recipeIdList: Joi.array().items(Joi.number()).min(1),
}).or('name', 'recipeIdList');

const getMealPlanQuerySchema = Joi.object({
  includeAggregatedIngredients: Joi.boolean().required(),
  includeIngredientsWithRecipes: Joi.boolean().required(),
});

export default class MealPlanController {
  constructor(
    private readonly mealPlanService: MealPlanService,
    private readonly eventsService: EventsService,
  ) {}

  async getMealPlan(req: Request, res: Response) {
    try {
      const { error, value } = getMealPlanQuerySchema.validate(req.query);
      const { includeAggregatedIngredients, includeIngredientsWithRecipes } =
        value;

      if (error) {
        throw new Error(error.message);
      }

      // validate params
      const mealPlanUuid = req.params.id + '';

      if (!validator.isUUID(mealPlanUuid)) {
        throw new Error('Invalid meal plan UUID argument');
      }

      const plan = await this.mealPlanService.getPlan(
        mealPlanUuid,
        includeAggregatedIngredients,
        includeIngredientsWithRecipes,
      );

      return res.status(200).json({
        result: plan,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('MEAL_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async saveMealPlan(req: Request, res: Response) {
    try {
      // validate body
      const { error, value } = insertMealPlanSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      // insert meal plan
      const { recipeIdList } = value;

      const uuid = await this.mealPlanService.createPlan(recipeIdList);

      await this.eventsService.insert(
        'MEAL_PLAN',
        'SUCCESS',
        `Recipe ${uuid} created`,
      );

      // return meal plan uuid
      return res.status(200).json({
        result: { uuid },
        errors: [],
      });

      // return meal plan uuid
    } catch (e: any) {
      await this.eventsService.insert('MEAL_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async updateMealPlan(req: Request, res: Response) {
    try {
      // validate params
      const mealPlanUuid = req.params.id + '';

      if (!validator.isUUID(mealPlanUuid)) {
        throw new Error('Invalid meal plan UUID argument');
      }

      // validate body
      // need valid name or recipeIdList or both
      const { error, value } = updateMealPlanSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const { name, recipeIdList } = value;

      // get all recipes and optional ingredients
      const { name: mealPlanName, uuid } =
        await this.mealPlanService.updatePlan({
          uuid: mealPlanUuid,
          ...(recipeIdList && { recipeIdList }),
          ...(typeof name === 'string' && { name }),
        });

      return res.status(200).json({
        result: { name: mealPlanName, uuid },
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('MEAL_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
