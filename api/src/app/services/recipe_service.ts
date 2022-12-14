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

  private getRecipesQuery = (includeIngredients: boolean) => {
    const rawQuery = this.db.raw(`
    (
      select *
      from (
        select 
          recipes.id, 
          recipes.name,
          CAST(recipes.price_per_serving as FLOAT),
          recipes.image_path,
          recipes.link,
          recipes.meal_type,
          recipes.lifestyle_type,
          recipes.free_from_type,
          recipes.created_at,
          (
            select 
              json_agg(ingredients) 
            from (
            select 
                ingredients.id,
                CAST(recipe_ingredients.unit_quantity as FLOAT),
                ingredients.name,
                CAST(ingredients.price_per_unit as FLOAT)
              from 
                recipe_ingredients 
              join 
                ingredients 
              on 
                recipe_ingredients.ingredient_id = ingredients.id
              where 
                recipe_ingredients.recipe_id = recipes.id
            ) as ingredients
          )  as ingredients_list
          from recipes
      ) as recipes) as recipes
  `);
    return this.db.select('*').from(includeIngredients ? rawQuery : 'recipes');
  };

  async getAll({
    includeIngredients = false,
    offset,
    limit,
    meals,
    lifestyles,
    freeFroms,
    order = 'any',
    orderBy = 'relevance',
    searchTerm = '',
  }: {
    includeIngredients: boolean;
    offset: number;
    limit: number;
    meals: Array<
      'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'sides' | 'dessert'
    >;
    lifestyles: Array<'vegetarian' | 'vegan' | 'meat' | 'pescatarian'>;
    freeFroms: Array<'dairyFree' | 'glutenFree'>;
    order: 'asc' | 'desc' | 'any';
    orderBy: 'relevance' | 'price' | 'createdAt';
    searchTerm: string;
  }) {
    const recipesQueryBuilder = this.getRecipesQuery(includeIngredients)
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

  async insertRecipe(
    recipeWithIngredients: RecipeWithIngredients & {
      meals: Array<
        'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'sides' | 'dessert'
      >;
      lifestyles: Array<'vegetarian' | 'vegan' | 'meat' | 'pescatarian'>;
      freeFroms: Array<'dairyFree' | 'glutenFree'>;
    },
  ) {
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
          },
          ['id'],
        )
        .transacting(trx);

      // insert recipe_plan_recipes with associated recipe_plan.id
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

      return recipe_id;
    });
  }

  async removeRecipe(recipeId: number): Promise<Recipe> {
    const result = await this.db('recipes').where('id', recipeId).del(['*']);
    return camelize(result[0]);
  }
}
