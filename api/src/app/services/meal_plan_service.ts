import { Knex } from 'knex';
import RecipeService from './recipe_service';

export default class MealPlanService {
  constructor(
    private readonly db: Knex,
    private readonly recipeService: RecipeService,
  ) {}

  async getPlan(
    uuid: string,
    includeAggregatedIngredients = false,
    includeIngredientsWithRecipes = false,
  ) {
    const result = await this.db('meal_plans').select('id').where('uuid', uuid);

    const { id: planId } = result[0];

    const rawQuery = this.db.raw(`
    (
      select
        recipes.meal_plan_name,
        recipes.meal_plan_id,
        recipes.meal_plan_created_by::INTEGER,
        recipes.recipes,
        ingredients.ingredients
      from
        (
          select
            mps.meal_plan_name,
            mps.meal_plan_created_by,
            mps.meal_plan_id,
            mps.recipes
          from
            (
              select
                meal_plans.name as meal_plan_name,
                meal_plans.created_by as meal_plan_created_by,
                meal_plan_recipes.meal_plan_id,
                json_agg(recipes.*) as recipes
              from
                meal_plans
                left join meal_plan_recipes on meal_plans.id = meal_plan_recipes.meal_plan_id
                left join recipes on meal_plan_recipes.recipe_id = recipes.id
              group by
                meal_plan_recipes.meal_plan_id,
                meal_plans.name,
                meal_plans.created_by
            ) as mps
        ) as recipes
        left join (
          select
            ings.meal_plan_id,
            json_agg(
              jsonb_build_object(
                'name',
                ings.ingredient_name,
                'id',
                ings.ingredient_id,
                'unit_quantity',
                ings.ingredient_quantity,
                'price_per_unit',
                ings.price_per_unit,
                'category_name',
                ings.category_name
              )
            ) AS ingredients
          from
            (
              select
                meal_plans.id as meal_plan_id,
                ingredients.id as ingredient_id,
                ingredients.name as ingredient_name,
                sum(recipe_ingredients.unit_quantity) as ingredient_quantity,
                ingredients.price_per_unit as price_per_unit,
                categories.name as category_name
              from
                meal_plans
                left join meal_plan_recipes on meal_plans.id = meal_plan_recipes.meal_plan_id
                left join recipes on meal_plan_recipes.recipe_id = recipes.id
                left join recipe_ingredients on recipes.id = recipe_ingredients.recipe_id
                left join ingredients on recipe_ingredients.ingredient_id = ingredients.id
                left join categories on ingredients.category_id = categories.id
              group by
                meal_plans.id,
                ingredients.id,
                ingredients.name,
                categories.name
            ) as ings
          group by
            meal_plan_id
        ) as ingredients on recipes.meal_plan_id = ingredients.meal_plan_id
    ) as meal_plans
    `);

    const mealPlanSelectColumns: Array<string> = [
      'meal_plans.meal_plan_name',
      'meal_plans.recipes',
      'meal_plans.meal_plan_created_by',
    ];

    if (includeAggregatedIngredients) {
      mealPlanSelectColumns.push('meal_plans.ingredients');
    }

    const mealPlanDecorated = await this.db
      .select(mealPlanSelectColumns)
      .from(rawQuery)
      .where('meal_plans.meal_plan_id', planId);

    if (includeIngredientsWithRecipes) {
      const response = await this.db('meal_plan_recipes')
        .select('recipe_id')
        .where('meal_plan_id', planId);

      const recipeIdsForMealPlan = response.map((r) => parseInt(r.recipe_id));

      const {
        recipes,
      }: {
        recipes: Array<any>;
      } = await this.recipeService.get({
        includeIngredientsWithRecipes,
        recipeIds: recipeIdsForMealPlan,
      });

      const recipesWithIngredients = recipes;
      mealPlanDecorated[0].recipes = recipesWithIngredients;
    }

    return mealPlanDecorated;
  }

  async createPlan(userId: number, recipe_id_list: Array<number>) {
    return await this.db.transaction(async (trx) => {
      // create a meal plan
      const result = await this.db('meal_plans')
        .insert({ created_by: userId }, ['id', 'uuid'])
        .transacting(trx);

      // insert meal_plan_recipes with associated meal_plan.id
      const { id: meal_plan_id, uuid: meal_plan_uuid } = result[0];
      const meal_plan_recipes = recipe_id_list.map((recipe_id) => ({
        meal_plan_id,
        recipe_id,
      }));

      await this.db('meal_plan_recipes')
        .insert(meal_plan_recipes)
        .transacting(trx);

      return meal_plan_uuid;
    });
  }

  async updatePlan({
    userId,
    uuid,
    recipeIdList,
    name,
  }: {
    userId: number;
    uuid: string;
    recipeIdList?: Array<number>;
    name?: string;
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
        const meal_plan_recipes = recipeIdList.map((recipe_id) => ({
          meal_plan_id: planId,
          recipe_id,
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
          .update({ name });
      }

      const mealPlan = await this.db('meal_plans')
        .select('id', 'name')
        .where('uuid', uuid)
        .transacting(trx);

      return { uuid, name: mealPlan[0].name };
    });
  }
}
