import { Knex } from 'knex';
import { Recipe, RecipeWithIngredients } from '../types/recipe.types';
// @ts-ignore
import snakeize from 'snakeize';
// @ts-ignore
import camelize from 'camelize';
import { toSnakeCase } from '../utils/toSnakeCase';
import { orderByToRecipeColumn } from '../utils/orderByToRecipeColumn';

export default class RecipeService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  private matchingRecipeIds =
    ({ recipeIds }: { recipeIds: Array<number> }) =>
    (queryBuilder: Knex.QueryBuilder) => {
      if (recipeIds.length) {
        queryBuilder.where('recipes.id', 'IN', [...recipeIds]);
      }
      return queryBuilder;
    };

  private recipeQueryFilters =
    ({
      meals,
      lifestyles,
      freeFroms,
    }: {
      meals: Array<
        'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'sides' | 'dessert'
      >;
      lifestyles: Array<'vegetarian' | 'vegan' | 'meat' | 'pescatarian'>;
      freeFroms: Array<'dairyFree' | 'glutenFree'>;
    }) =>
    (queryBuilder: Knex.QueryBuilder) => {
      const freeFromsSnakeCase = <Array<'dairy_free' | 'gluten_free'>>(
        freeFroms.map((freeFrom) => toSnakeCase(freeFrom))
      );

      if (meals.length) {
        queryBuilder.where(
          this.db.raw(`meal_type && ARRAY['${meals.join("','")}']::MEAL[]`),
        );
      }
      if (lifestyles.length) {
        queryBuilder.where(
          this.db.raw(
            `lifestyle_type && ARRAY['${lifestyles.join("','")}']::LIFESTYLE[]`,
          ),
        );
      }
      if (freeFroms.length) {
        queryBuilder.where(
          this.db.raw(
            `free_from_type && ARRAY['${freeFromsSnakeCase.join(
              "','",
            )}']::FREE_FROM[]`,
          ),
        );
      }
      return queryBuilder;
    };

  private recipeQuerySearch =
    ({ searchTerm }: { searchTerm: string }) =>
    (queryBuilder: Knex.QueryBuilder) => {
      if (searchTerm.length) {
        queryBuilder.whereRaw(`name ILIKE ?`, [`%${searchTerm}%`]);
      }
      return queryBuilder;
    };

  private recipeQueryOrdering =
    ({
      order,
      orderBy,
    }: {
      order: 'asc' | 'desc' | 'any';
      orderBy: 'relevance' | 'price' | 'createdAt';
    }) =>
    (queryBuilder: Knex.QueryBuilder) => {
      const col = orderByToRecipeColumn(orderBy);
      if (order.length && orderBy.length) {
        const colOrder = order === 'any' ? 'asc' : order;
        queryBuilder.orderBy(col, colOrder);
      }

      return queryBuilder;
    };

  private getRecipesQuery = (includeIngredientsWithRecipes: boolean) => {
    const rawQuery = this.db.raw(`
  (
    select
      *
    from
      (
        select
          recipes.id,
          recipes.name,
          recipes.servings,
          recipes.created_at,
          CAST(recipes.price_per_serving as FLOAT),
          recipes.image_path,
          recipes.link,
          recipes.meal_type,
          recipes.lifestyle_type,
          recipes.free_from_type,
          recipes.prep_time,
          recipes.cook_time,
          (
            select
              json_agg(ingredients)
            from
              (
                select
                  ingredients.id,
                  CAST(recipe_ingredients.unit_quantity as FLOAT),
                  ingredients.name,
                  CAST(ingredients.price_per_unit as FLOAT)
                from
                  recipe_ingredients
                  inner join ingredients on recipe_ingredients.ingredient_id = ingredients.id
                where
                  recipe_ingredients.recipe_id = recipes.id
              ) as ingredients
          ) as ingredients_list,
          (
            select
              json_agg(instructions)
            from
              (
                select
                  recipe_instructions.id,
                  recipe_instructions.instruction,
                  recipe_instructions.step
                from
                  recipe_instructions
                where
                  recipe_instructions.recipe_id = recipes.id
              ) as instructions
          ) as instructions_list
        from
          recipes
      ) as recipes) as recipes
  `);
    return this.db
      .select('*')
      .from(includeIngredientsWithRecipes ? rawQuery : 'recipes');
  };

  async get({
    includeIngredientsWithRecipes = false,
    offset = 0,
    limit = 10,
    meals = [],
    lifestyles = [],
    freeFroms = [],
    order = 'any',
    orderBy = 'relevance',
    searchTerm = '',
    recipeIds = [],
  }: {
    includeIngredientsWithRecipes: boolean;
    offset?: number;
    limit?: number;
    meals?: Array<
      'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'sides' | 'dessert'
    >;
    lifestyles?: Array<'vegetarian' | 'vegan' | 'meat' | 'pescatarian'>;
    freeFroms?: Array<'dairyFree' | 'glutenFree'>;
    order?: 'asc' | 'desc' | 'any';
    orderBy?: 'relevance' | 'price' | 'createdAt';
    searchTerm?: string;
    recipeIds?: Array<number>;
  }) {
    const recipesQueryBuilder = this.getRecipesQuery(
      includeIngredientsWithRecipes,
    )
      .modify(this.matchingRecipeIds({ recipeIds }))
      .modify(
        this.recipeQueryFilters({
          meals,
          lifestyles,
          freeFroms,
        }),
      )
      .modify(
        this.recipeQuerySearch({
          searchTerm,
        }),
      )
      .modify(
        this.recipeQueryOrdering({
          order,
          orderBy,
        }),
      )
      .offset(offset)
      .limit(limit);

    const countBuilder = this.db
      .count('*')
      .from('recipes')
      .modify(this.matchingRecipeIds({ recipeIds }))
      .modify(
        this.recipeQueryFilters({
          meals,
          lifestyles,
          freeFroms,
        }),
      )
      .modify(
        this.recipeQuerySearch({
          searchTerm,
        }),
      );

    const recipesResult = await recipesQueryBuilder;
    const countResult = await countBuilder;
    const { count } = <{ count: string }>countResult[0];
    return { recipes: recipesResult, count };
  }

  async insertRecipe(recipeWithIngredients: RecipeWithIngredients) {
    // convert recipe to snake case
    const recipeWithIngredientsSnake = snakeize(recipeWithIngredients);

    return await this.db.transaction(async (trx) => {
      const {
        name,
        servings,
        price_per_serving,
        image_path,
        link,
        ingredients,
        meals,
        lifestyles,
        free_froms,
        cook_time,
        prep_time,
        instructions,
      } = recipeWithIngredientsSnake;

      const freeFromsSnakeCase = <Array<'dairy_free' | 'gluten_free'>>(
        free_froms.map((freeFrom: string) => toSnakeCase(freeFrom))
      );

      // insert recipe
      const result = await this.db('recipes')
        .insert(
          {
            name,
            servings,
            price_per_serving,
            image_path,
            link,
            meal_type: [...meals],
            lifestyle_type: [...lifestyles],
            free_from_type: [...freeFromsSnakeCase],
            cook_time,
            prep_time,
          },
          ['id'],
        )
        .transacting(trx);

      // insert meal_plan_recipes with associated meal_plan.id
      const { id: recipe_id } = result[0];
      const recipe_ingredients = ingredients.map(
        ({
          id: ingredient_id,
          unit_quantity,
        }: {
          id: number;
          unit_quantity: number;
        }) => ({
          recipe_id,
          ingredient_id,
          unit_quantity,
        }),
      );

      await this.db('recipe_ingredients')
        .insert(recipe_ingredients)
        .transacting(trx);

      // insert recipe_instructions with associated recipe_id
      const recipe_instructions = instructions.map(
        (instruction: string, index: number) => {
          const step = index + 1;
          return {
            step,
            instruction,
            recipe_id,
          };
        },
      );

      await this.db('recipe_instructions')
        .insert(recipe_instructions)
        .transacting(trx);

      return recipe_id;
    });
  }

  async removeRecipe(recipeId: number): Promise<Recipe> {
    const result = await this.db('recipes').where('id', recipeId).del(['*']);
    return camelize(result[0]);
  }
}
