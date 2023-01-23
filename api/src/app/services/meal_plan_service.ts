import { Knex } from 'knex';
import {
  getMealPlansBaseQuery,
  matchingCreatedByQuery,
  mealPlanQueryOrdering,
  mealPlanQuerySearch,
  getMealPlanQuery,
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
    includeSupermarketDetails = false,
  }: {
    userId: number;
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc' | 'any';
    orderBy?: 'relevance' | 'createdAt';
    searchTerm?: string;
    includeSupermarketDetails?: boolean;
  }) {
    return (
      getMealPlansBaseQuery(this.db, includeSupermarketDetails)
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

  async getPlan({
    mealPlanUuid,
    includeSupermarketDetails = false,
  }: {
    mealPlanUuid: string;
    includeSupermarketDetails?: boolean;
  }) {
    // get single meal plan using a meal plan uuid
    const mealPlanQueryBuilder = getMealPlanQuery(
      this.db,
      includeSupermarketDetails,
    ).where('uuid', mealPlanUuid);

    const mealPlanResult = await mealPlanQueryBuilder;

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
    supermarketId: number,
  ) {
    return await this.db.transaction(async (trx) => {
      // create a meal plan
      const result = await this.db('meal_plans')
        .insert({ created_by: userId, supermarket_id: supermarketId }, [
          'id',
          'uuid',
        ])
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
    supermarketId,
  }: {
    userId: number;
    uuid: string;
    recipeIdList?: Array<{ recipeId: number; servings: number }>;
    name?: string;
    totalServings: number;
    totalPrice: number;
    ingredientsCount: number;
    recipesCount: number;
    supermarketId?: number | undefined;
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

      // update supermarket id (useful if in the future we want to allow users to alter supermarket of their meal plan)
      if (supermarketId) {
        await this.db('meal_plans')
          .where('uuid', uuid)
          .andWhere('created_by', userId)
          .update({ supermarket_id: supermarketId })
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

  async removeMealPlan(mealPlanUuid: string, userId: number): Promise<any> {
    try {
      return await this.db.transaction(async (trx) => {
        // find meal plan with uuid and created by user
        const mealPlanResponse = await this.db('meal_plans')
          .select('id')
          .where('uuid', mealPlanUuid)
          .andWhere('created_by', userId)
          .transacting(trx);

        const { id: planId } = mealPlanResponse[0];

        // delete meal plan
        const result = await this.db('meal_plans')
          .where('uuid', mealPlanUuid)
          .andWhere('created_by', userId)
          .del(['*'])
          .transacting(trx);

        // delete associated meal plan metrics
        await this.db('meal_plan_metrics')
          .where('meal_plan_metrics.meal_plan_id', planId)
          .del(['*'])
          .transacting(trx);

        return camelize(result[0]);
      });
    } catch (error: any) {
      return error.message;
    }
  }

  async updateMealPlanMetrics() {
    return this.db.raw(`
insert into meal_plan_metrics 
select 
  ROW_NUMBER() OVER (
    ORDER BY 
      meal_plan_id ASC
  ) row_number, 
  meal_plan_id, 
  recipes_count, 
  ingredients_count, 
  total_servings, 
  total_price 
from 
  (
    select 
      recipe_metrics.meal_plan_id, 
      recipes_count, 
      ingredients_count, 
      total_servings, 
      total_price 
    from 
      (
        select 
          count(ingredient_id) as ingredients_count, 
          meal_plan_id, 
          sum(total_ingredient_price) as total_price 
        from 
          (
            select 
              ingredient_id, 
              meal_plan_id, 
              sum(ingredient_quantity) as total_ingredient_quantity, 
              ceiling(
                sum(ingredient_quantity)
              ) * ingredient_price_per_unit as total_ingredient_price 
            from 
              (
                select 
                  recipes.id as recipe_id, 
                  meal_plan_recipes.meal_plan_id, 
                  ingredients.id as ingredient_id, 
                  recipe_ingredients.unit_quantity * (
                    meal_plan_recipes.servings / recipes.base_servings
                  ) as ingredient_quantity, 
                  recipe_ingredients.unit_quantity * (
                    meal_plan_recipes.servings / recipes.base_servings
                  ) * ingredients.price_per_unit as total_ingredient_price, 
                  ingredients.price_per_unit as ingredient_price_per_unit 
                from 
                  recipes 
                  join meal_plan_recipes on meal_plan_recipes.recipe_id = recipes.id 
                  join meal_plans on meal_plans.id = meal_plan_recipes.meal_plan_id 
                  join recipe_ingredients on recipe_ingredients.recipe_id = recipes.id 
                  join ingredients on ingredients.id = recipe_ingredients.ingredient_id
              ) as meal_plan_ingredients 
            group by 
              ingredient_id, 
              meal_plan_id, 
              ingredient_price_per_unit
          ) as aggregated_meal_plan_ingredients 
        group by 
          meal_plan_id
      ) as ingredient_metrics 
      join (
        select 
          count(recipes.id) as recipes_count, 
          meal_plans.id as meal_plan_id, 
          sum(meal_plan_recipes.servings) as total_servings 
        from 
          recipes 
          join meal_plan_recipes on meal_plan_recipes.recipe_id = recipes.id 
          join meal_plans on meal_plans.id = meal_plan_recipes.meal_plan_id 
        group by 
          meal_plans.id
      ) as recipe_metrics on recipe_metrics.meal_plan_id = ingredient_metrics.meal_plan_id
  ) as meal_plan_metric_data ON CONFLICT (meal_plan_id) DO 
UPDATE 
SET 
  recipes_count = EXCLUDED.recipes_count, 
  ingredients_count = EXCLUDED.ingredients_count, 
  total_servings = EXCLUDED.total_servings, 
  total_price = EXCLUDED.total_price;
`);
  }
}
