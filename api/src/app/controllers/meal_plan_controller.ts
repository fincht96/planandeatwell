import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import MealPlanService from '../services/meal_plan_service';
import validator from 'validator';
import Joi from 'joi';

const insertMealPlanSchema = Joi.object({
  recipeIdList: Joi.array()
    .items(
      Joi.object({
        recipeId: Joi.number().min(1).required(),
        servings: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  totalServings: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required(),
  ingredientsCount: Joi.number().min(0).required(),
  recipesCount: Joi.number().min(0).required(),
});

const updateMealPlanSchema = Joi.object({
  name: Joi.string().max(200),
  recipeIdList: Joi.array()
    .items(
      Joi.object({
        recipeId: Joi.number().min(1).required(),
        servings: Joi.number().min(1).required(),
      }),
    )
    .min(1),
  totalServings: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required(),
  ingredientsCount: Joi.number().min(0).required(),
  recipesCount: Joi.number().min(0).required(),
})
  .or('name', 'recipeIdList')
  .and('totalServings', 'totalPrice', 'ingredientsCount', 'recipesCount');

const getMealPlansQuerySchema = Joi.object({
  userId: Joi.number().min(1).required(),
  offset: Joi.number().min(0),
  limit: Joi.number().min(1).max(100).required(),
  order: Joi.string().valid('asc', 'desc', 'any'),
  orderBy: Joi.string().valid('relevance', 'createdAt'),
  searchTerm: Joi.string().min(2).max(200),
  includeCount: Joi.boolean().default(false),
});

const removeMealPlanSchema = Joi.object({
  mealPlanUuid: Joi.string().min(1).required(),
});
export default class MealPlanController {
  constructor(
    private readonly mealPlanService: MealPlanService,
    private readonly eventsService: EventsService,
  ) {}

  async getMealPlans(req: Request, res: Response) {
    try {
      // validate and sanitize params
      const { error, value } = getMealPlansQuerySchema.validate(req.query);

      if (error) {
        throw new Error(error.message);
      }

      // resource access authorization
      if (req.user.planandeatwell_id !== value.userId) {
        throw new Error('User does not have permission to access resource');
      }

      const mealPlans = await this.mealPlanService.getManyPlans(value);
      let count = null;

      if (value.includeCount) {
        count = await this.mealPlanService.getPlansCount(value);
      }

      return res.status(200).json({
        result: {
          mealPlans,
          ...(count && { count }),
        },
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('MEAL_PLAN', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async getMealPlan(req: Request, res: Response) {
    try {
      // validate params
      const mealPlanUuid = req.params.id + '';

      if (!validator.isUUID(mealPlanUuid)) {
        throw new Error('Invalid meal plan UUID argument');
      }

      const plan = await this.mealPlanService.getPlan(mealPlanUuid);

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
      const {
        recipeIdList,
        totalServings,
        totalPrice,
        ingredientsCount,
        recipesCount,
      } = value;

      const uuid = await this.mealPlanService.createPlan(
        req.user.planandeatwell_id,
        recipeIdList,
        totalServings,
        totalPrice,
        ingredientsCount,
        recipesCount,
      );

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

      const {
        name,
        recipeIdList,
        totalServings,
        totalPrice,
        ingredientsCount,
        recipesCount,
      } = value;

      // get all recipes and optional ingredients
      const { name: mealPlanName, uuid } =
        await this.mealPlanService.updatePlan({
          userId: req.user.planandeatwell_id,
          uuid: mealPlanUuid,
          ...(recipeIdList && { recipeIdList }),
          ...(typeof name === 'string' && { name }),
          totalServings,
          totalPrice,
          ingredientsCount,
          recipesCount,
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

  async removeMealPlan(req: Request, res: Response) {
    try {
      const { error, value } = removeMealPlanSchema.validate(req.params);

      if (error) {
        throw new Error(error.message);
      }

      // remove meal plan from db
      const removedMealPlan = await this.mealPlanService.removeMealPlan(
        value.mealPlanUuid,
      );

      return res.status(200).json({
        result: removedMealPlan,
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
