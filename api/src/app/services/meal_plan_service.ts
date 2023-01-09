import { Knex } from 'knex';
import {
  getMealPlansBaseQuery,
  matchingCreatedByQuery,
  mealPlanQueryOrdering,
  mealPlanQuerySearch,
} from '../utils/mealPlanQueryBuilder';
import { roundTo2dp } from '../utils/roundTo2dp';
import RecipeService from './recipe_service';
// @ts-ignore
import camelize from 'camelize';

export default class MealPlanService {
  constructor(
    private readonly db: Knex,
    private readonly recipeService: RecipeService,
  ) {}

  async getPlansCount({
    userId,
    searchTerm = '',
  }: {
    userId: number;
    searchTerm?: string;
  }) {
    // only single userId is used, though multiple userIds is supported
    const result = await this.db('meal_plans')
      .modify(matchingCreatedByQuery({ userIds: [userId] }))
      .modify(
        mealPlanQuerySearch({
          searchTerm,
        }),
      )
      .count();
    return result[0].count;
  }

  async getManyPlans({
    userId,
    offset = 0,
    limit = 10,
    order = 'any',
    orderBy = 'relevance',
    searchTerm = '',
  }: {
    userId: number;
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc' | 'any';
    orderBy?: 'relevance' | 'createdAt';
    searchTerm?: string;
  }) {
    return (
      getMealPlansBaseQuery(this.db)
        // only single userId is used, though multiple userIds is supported
        .modify(matchingCreatedByQuery({ userIds: [userId] }))
        .modify(
          mealPlanQuerySearch({
            searchTerm,
          }),
        )
        .modify(
          mealPlanQueryOrdering({
            order,
            orderBy,
          }),
        )
        .offset(offset)
        .limit(limit)
    );
  }

  async getPlan(uuid: string) {
    // get meal plan
    const mealPlanResult = await this.db('meal_plans')
      .select(this.db.raw('id, created_at, created_by::INTEGER, name, uuid'))
      .where('uuid', uuid);
    const { id: planId } = mealPlanResult[0];

    // get recipe ids and # servings associated with meal plan
    const mealPlanRecipesResult = await this.db('meal_plan_recipes')
      .select('recipe_id', 'servings')
      .where('meal_plan_id', planId);

    const recipeIdsForMealPlan = mealPlanRecipesResult.map((r) =>
      parseInt(r.recipe_id),
    );

    // get recipes in meal plan
    const recipesInMealPlanResult = await this.recipeService.get({
      includeIngredientsWithRecipes: true,
      limit: 100, // Max 100 recipes in meal plan
      recipeIds: recipeIdsForMealPlan,
    });

    return {
      ...mealPlanResult[0],
      recipes: recipesInMealPlanResult.recipes.map((recipe: any) => {
        const servings =
          mealPlanRecipesResult.find(
            (mealPlanRecipe) => mealPlanRecipe.recipe_id === recipe.id,
          )?.servings ?? 0;
        return {
          recipe,
          servings,
        };
      }),
    };
  }

  async createPlan(
    userId: number,
    recipe_id_list: Array<{ recipeId: number; servings: number }>,
    totalServings: number,
    totalPrice: number,
    ingredientsCount: number,
    recipesCount: number,
  ) {
    return await this.db.transaction(async (trx) => {
      // create a meal plan
      const result = await this.db('meal_plans')
        .insert({ created_by: userId }, ['id', 'uuid'])
        .transacting(trx);

      // insert meal_plan_recipes with associated meal_plan.id and # servings
      const { id: meal_plan_id, uuid: meal_plan_uuid } = result[0];
      const meal_plan_recipes = recipe_id_list.map((recipe) => ({
        meal_plan_id,
        recipe_id: recipe.recipeId,
        servings: recipe.servings,
      }));

      await this.db('meal_plan_recipes')
        .insert(meal_plan_recipes, ['*'])
        .transacting(trx);

      // insert meal plan metrics
      await this.db('meal_plan_metrics')
        .insert(
          {
            meal_plan_id,
            total_price: roundTo2dp(totalPrice),
            recipes_count: recipesCount,
            total_servings: totalServings,
            ingredients_count: ingredientsCount,
          },
          [],
        )
        .transacting(trx);

      return meal_plan_uuid;
    });
  }

  async updatePlan({
    userId,
    uuid,
    recipeIdList,
    name,
    totalServings,
    totalPrice,
    ingredientsCount,
    recipesCount,
  }: {
    userId: number;
    uuid: string;
    recipeIdList?: Array<{ recipeId: number; servings: number }>;
    name?: string;
    totalServings: number;
    totalPrice: number;
    ingredientsCount: number;
    recipesCount: number;
  }) {
    return await this.db.transaction(async (trx) => {
      // find meal plan with uuid and created by user
      const result = await this.db('meal_plans')
        .select('id')
        .where('uuid', uuid)
        .andWhere('created_by', userId)
        .transacting(trx);

      const { id: planId } = result[0];

      // update recipes associated with meal_plan (if provided recipeIdList)
      if (recipeIdList?.length) {
        // delete recipe_meal_plan rows associated with meal plan id
        await this.db('meal_plan_recipes')
          .where('meal_plan_id', planId)
          .del()
          .transacting(trx);

        // insert meal_plan_recipes with associated meal_plan.id
        const meal_plan_recipes = recipeIdList.map((recipe) => ({
          meal_plan_id: planId,
          recipe_id: recipe.recipeId,
          servings: recipe.servings,
        }));

        await this.db('meal_plan_recipes')
          .insert(meal_plan_recipes)
          .transacting(trx);
      }

      // update meal_plan name (if provided meal_plan name)
      if (name) {
        await this.db('meal_plans')
          .where('uuid', uuid)
          .andWhere('created_by', userId)
          .update({ name })
          .transacting(trx);
      }

      // update meal plan metrics
      await this.db('meal_plan_metrics')
        .update({
          meal_plan_id: planId,
          total_price: roundTo2dp(totalPrice),
          recipes_count: recipesCount,
          total_servings: totalServings,
          ingredients_count: ingredientsCount,
        })
        .where('meal_plan_metrics.meal_plan_id', planId)
        .transacting(trx);

      const mealPlan = await this.db('meal_plans')
        .select('id', 'name')
        .where('uuid', uuid)
        .transacting(trx);

      return { uuid, name: mealPlan[0].name };
    });
  }

  async removeMealPlan(mealPlanUuid: string): Promise<any> {
    try {
      const result = await this.db('meal_plans')
        .where('uuid', mealPlanUuid)
        .del(['*']);
      return camelize(result[0]);
    } catch (error: any) {
      return error.message;
    }
  }
}
