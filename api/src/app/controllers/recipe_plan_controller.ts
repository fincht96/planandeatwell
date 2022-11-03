import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import RecipePlanService from '../services/recipe_plan_service';
import validator from 'validator';
import Joi, { ValidationResult } from 'joi';

const bodySchema = Joi.object({
  recipeIdList: Joi.array().items(Joi.number()).required(),
});

export default class RecipePlanController {
  constructor(
    private readonly recipePlanService: RecipePlanService,
    private readonly eventsService: EventsService,
  ) {}

  async getRecipePlan(req: Request, res: Response) {
    try {
      // validate params
      const recipePlanUuid = req.params.id + '';
      const includeIngredients = req.query.includeIngredients + '';

      if (!validator.isUUID(recipePlanUuid)) {
        throw new Error('Invalid recipe plan UUID argument');
      }

      if (
        req.query?.includeIngredients &&
        !validator.isBoolean(includeIngredients)
      ) {
        throw new Error('Invalid argument provided');
      }

      // get all recipes and optional ingredients
      const plan = await this.recipePlanService.getPlan(
        recipePlanUuid,
        req.query?.includeIngredients
          ? validator.toBoolean(includeIngredients)
          : false,
      );

      return res.status(200).json({
        result: plan,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('RECIPE_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async saveRecipePlan(req: Request, res: Response) {
    try {
      // validate body
      const { error, value } = bodySchema.validate(req.body);

      if (error) {
        throw new Error('Invalid recipeIdList provided');
      }

      // insert recipe plan
      const { recipeIdList } = value;

      const uuid = await this.recipePlanService.createPlan(recipeIdList);

      await this.eventsService.insert(
        'RECIPE_PLAN',
        'SUCCESS',
        `Recipe ${uuid} created`,
      );

      // return recipe plan uuid
      return res.status(200).json({
        result: { uuid },
        errors: [],
      });

      // return recipe plan uuid
    } catch (e: any) {
      await this.eventsService.insert('RECIPE_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
