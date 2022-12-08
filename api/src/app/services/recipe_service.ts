import { Knex } from 'knex';
import { Recipe, RecipeWithIngredients } from '../types/recipe.types';
// @ts-ignore
import snakeize from 'snakeize';
// @ts-ignore
import camelize from 'camelize';

export default class RecipeService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async get({
    includeIngredientsWithRecipes = false,
    offset,
    limit,
    recipeIds,
  }: {
    includeIngredientsWithRecipes: boolean;
    offset?: number;
    limit?: number;
    recipeIds?: Array<number>;
  }) {
    const rawQuery = this.db.raw(`
    (
      select *
      from (
        select 
          recipes.id, 
          recipes.name,
          recipes.servings,
          recipes.created_at,
          CAST(recipes.price_per_serving as FLOAT),
          recipes.image_path,
          recipes.link,
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

    const recipes = await this.db.select('*').modify((queryBuilder) => {
      queryBuilder.from(includeIngredientsWithRecipes ? rawQuery : 'recipes');

      if (offset) {
        queryBuilder.offset(offset);
      }

      if (limit) {
        queryBuilder.limit(limit);
      }

      if (recipeIds && recipeIds.length > 0) {
        queryBuilder.where('recipes.id', 'IN', [...recipeIds]);
      }
    });

    const results = await this.db.count('*').modify((queryBuilder) => {
      queryBuilder.from(includeIngredientsWithRecipes ? rawQuery : 'recipes');

      if (recipeIds && recipeIds.length > 0) {
        queryBuilder.where('recipes.id', 'IN', [...recipeIds]);
      }
    });

    const { count } = <{ count: string }>results[0];
    return { recipes, count: parseInt(count) };
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
      } = recipeWithIngredientsSnake;
      // insert recipe
      const result = await this.db('recipes')
        .insert({ name, servings, price_per_serving, image_path, link }, ['id'])
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
