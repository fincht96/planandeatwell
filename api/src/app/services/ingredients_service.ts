import { Knex } from 'knex';
import { Ingredient } from '../types/ingredient.types';
// @ts-ignore
import snakeize from 'snakeize';
// @ts-ignore
import camelize from 'camelize';
import { toSnakeCase } from '../utils/toSnakeCase';

export default class IngredientsService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async getIngredients(orderOptions: {
    orderBy?: 'createdAt';
    order?: 'asc' | 'desc';
  }) {
    const { orderBy, order } = orderOptions;
    return this.db
      .select('*', this.db.raw('CAST(ingredients.price_per_unit as FLOAT)'))
      .from('ingredients')
      .modify((qb) => {
        if (!!orderBy && !!order) {
          qb.orderBy(toSnakeCase(orderBy), order);
        }
      });
  }

  async getIngredientsFromRecipe(recipeId: number) {
    const rawQuery = this.db.raw(
      `
    (
        SELECT 
            ingredients.id,
            CAST(recipe_ingredients.unit_quantity as FLOAT),
            ingredients.name,
            CAST(ingredients.price_per_unit as FLOAT) 
        FROM
            recipe_ingredients
        INNER JOIN 
            ingredients
        ON recipe_ingredients.ingredient_id = ingredients.id
        WHERE
            recipe_ingredients.recipe_id = ?) as recipe_ingredients
      `,
      [recipeId],
    );

    return this.db.select('*').from(rawQuery);
  }

  async searchIngredients(searchString: string) {
    const rawQuery = this.db.raw(
      `
    (
      SELECT 
        ingredients.id,
        ingredients.name,
        CAST(ingredients.price_per_unit as FLOAT) 
      FROM 
        ingredients
      WHERE 
        position(? in lower(ingredients.name))>0
      ) as ingredients
      `,
      [searchString],
    );

    return this.db.select('*').from(rawQuery).limit(30);
  }

  async insertIngredient(ingredient: Ingredient) {
    // convert recipe to snake case
    const ingredientSnake = snakeize(ingredient);
    return await this.db.transaction(async (trx) => {
      const { name, price_per_unit, product_id } = ingredientSnake;
      // insert ingredient
      const result = await this.db('ingredients')
        .insert({ name, price_per_unit, product_id }, ['*'])
        .transacting(trx);
      return camelize(result[0]);
    });
  }

  async removeIngredient(ingredientId: number): Promise<Ingredient> {
    const result = await this.db('ingredients')
      .where('id', ingredientId)
      .del(['*']);
    return camelize(result[0]);
  }
}
