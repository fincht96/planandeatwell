import { Knex } from 'knex';

export default class RecipePlanService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async getPlan(uuid: string, includeIngredients: boolean = false) {
    const result = await this.db('recipe_plans')
      .select('id')
      .where('uuid', uuid);

    const { id: planId } = result[0];

    const rawQuery = this.db.raw(`
(select 
  recipes.recipe_plan_name,
  recipes.recipe_plan_id, 
  recipes.recipes, 
  ingredients.ingredients 
from 
  (
    select 
      rps.recipe_plan_name,
      rps.recipe_plan_id, 
      rps.recipes 
    from 
      (
        select
          recipe_plans.name as recipe_plan_name,
          recipe_plan_recipes.recipe_plan_id, 
          json_agg(recipes.*) as recipes 
        from 
          recipe_plans 
          left join recipe_plan_recipes on recipe_plans.id = recipe_plan_recipes.recipe_plan_id 
          left join recipes on recipe_plan_recipes.recipe_id = recipes.id 
        group by 
          recipe_plan_recipes.recipe_plan_id, recipe_plans.name
      ) as rps
  ) as recipes 
  left join (
    select 
      ings.recipe_plan_id, 
      json_agg(
        jsonb_build_object(
          'name', ings.ingredient_name, 'id', 
          ings.ingredient_id, 'quantity', 
          ings.ingredient_quantity, 'price_per_unit', 
          ings.price_per_unit
        )
      ) AS ingredients 
    from 
      (
        select 
          recipe_plans.id as recipe_plan_id, 
          ingredients.id as ingredient_id, 
          ingredients.name as ingredient_name, 
          sum(
            recipe_ingredients.unit_quantity
          ) as ingredient_quantity, 
          ingredients.price_per_unit as price_per_unit 
        from 
          recipe_plans 
          left join recipe_plan_recipes on recipe_plans.id = recipe_plan_recipes.recipe_plan_id 
          left join recipes on recipe_plan_recipes.recipe_id = recipes.id 
          left join recipe_ingredients on recipes.id = recipe_ingredients.recipe_id 
          left join ingredients on recipe_ingredients.ingredient_id = ingredients.id 
        group by 
          recipe_plans.id, 
          ingredients.id, 
          ingredients.name
      ) as ings 
    group by 
      recipe_plan_id
  ) as ingredients on recipes.recipe_plan_id = ingredients.recipe_plan_id) as recipe_plans

      `);

    const found = includeIngredients
      ? await this.db
          .select(
            'recipe_plans.recipe_plan_name',
            'recipe_plans.recipes',
            'recipe_plans.ingredients',
          )
          .from(rawQuery)
          .where('recipe_plans.recipe_plan_id', planId)
      : await this.db
          .select('recipe_plans.recipe_plan_name', 'recipe_plans.recipes')
          .from(rawQuery)
          .where('recipe_plans.recipe_plan_id', planId);

    return found;
  }

  async createPlan(recipe_id_list: Array<number>) {
    return await this.db.transaction(async (trx) => {
      // create a recipe plan
      const result = await this.db('recipe_plans')
        .insert({}, ['id', 'uuid'])
        .transacting(trx);

      // insert recipe_plan_recipes with associated recipe_plan.id
      const { id: recipe_plan_id, uuid: recipe_plan_uuid } = result[0];
      const recipe_plan_recipes = recipe_id_list.map((recipe_id) => ({
        recipe_plan_id,
        recipe_id,
      }));

      await this.db('recipe_plan_recipes')
        .insert(recipe_plan_recipes)
        .transacting(trx);

      return recipe_plan_uuid;
    });
  }

  async updatePlan({
    uuid,
    recipeIdList,
    name,
  }: {
    uuid: string;
    recipeIdList?: Array<number>;
    name?: string;
  }) {
    return await this.db.transaction(async (trx) => {
      const result = await this.db('recipe_plans')
        .select('id')
        .where('uuid', uuid)
        .transacting(trx);

      const { id: planId } = result[0];

      // update recipes associated with recipe_plan (if provided recipeIdList)
      if (recipeIdList?.length) {
        // delete recipe_recipe_plan rows associated with recipe plan id
        await this.db('recipe_plan_recipes')
          .where('recipe_plan_id', planId)
          .del()
          .transacting(trx);

        // insert recipe_plan_recipes with associated recipe_plan.id
        const recipe_plan_recipes = recipeIdList.map((recipe_id) => ({
          recipe_plan_id: planId,
          recipe_id,
        }));

        await this.db('recipe_plan_recipes')
          .insert(recipe_plan_recipes)
          .transacting(trx);
      }

      // update recipe_plan name (if provided recipe_plan name)
      if (name) {
        await this.db('recipe_plans').where('id', planId).update({ name });
      }

      const recipePlan = await this.db('recipe_plans')
        .select('id', 'name')
        .where('uuid', uuid)
        .transacting(trx);

      return { uuid, name: recipePlan[0].name };
    });
  }
}
