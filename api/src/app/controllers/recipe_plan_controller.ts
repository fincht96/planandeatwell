import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import RecipePlanService from '../services/recipe_plan_service';
import validator from 'validator';
import Joi from 'joi';

const insertRecipePlanSchema = Joi.object({
  recipeIdList: Joi.array().items(Joi.number()).required(),
});

const updateRecipePlanSchema = Joi.object({
  name: Joi.string().max(200),
  recipeIdList: Joi.array().items(Joi.number()).min(1),
}).or('name', 'recipeIdList');

const getRecipePlanQuerySchema = Joi.object({
  includeAggregatedIngredients: Joi.boolean().required(),
  includeIngredientsWithRecipes: Joi.boolean().required(),
});

export default class RecipePlanController {
  constructor(
    private readonly recipePlanService: RecipePlanService,
    private readonly eventsService: EventsService,
  ) {}

  async getRecipePlan(req: Request, res: Response) {
    try {
      const { error, value } = getRecipePlanQuerySchema.validate(req.query);
      const { includeAggregatedIngredients, includeIngredientsWithRecipes } =
        value;

      if (error) {
        throw new Error(error.message);
      }

      // validate params
      const recipePlanUuid = req.params.id + '';

      if (!validator.isUUID(recipePlanUuid)) {
        throw new Error('Invalid recipe plan UUID argument');
      }

      const plan = await this.recipePlanService.getPlan(
        recipePlanUuid,
        includeAggregatedIngredients,
        includeIngredientsWithRecipes,
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
      const { error, value } = insertRecipePlanSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
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

  async updateRecipePlan(req: Request, res: Response) {
    try {
      // validate params
      const recipePlanUuid = req.params.id + '';

      if (!validator.isUUID(recipePlanUuid)) {
        throw new Error('Invalid recipe plan UUID argument');
      }

      // validate body
      // need valid name or recipeIdList or both
      const { error, value } = updateRecipePlanSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const { name, recipeIdList } = value;

      // get all recipes and optional ingredients
      const { name: recipePlanName, uuid } =
        await this.recipePlanService.updatePlan({
          uuid: recipePlanUuid,
          ...(recipeIdList && { recipeIdList }),
          ...(typeof name === 'string' && { name }),
        });

      return res.status(200).json({
        result: { name: recipePlanName, uuid },
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('RECIPE_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
