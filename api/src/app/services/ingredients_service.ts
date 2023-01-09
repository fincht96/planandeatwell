import { Knex } from 'knex';
import { Ingredient } from '../types/ingredient.types';
// @ts-ignore
import snakeize from 'snakeize';
// @ts-ignore
import camelize from 'camelize';
import {
  getIngredientsBaseQuery,
  ingredientQueryOrdering,
  matchingIngredientIds,
} from '../utils/ingredientsQueryBuilder';

export default class IngredientsService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  private matchingSupermarketId =
    ({ supermarketId }: { supermarketId: number | null }) =>
    (queryBuilder: Knex.QueryBuilder) => {
      if (supermarketId) {
        queryBuilder.andWhere('ingredients.supermarket_id', supermarketId);
      }
      return queryBuilder;
    };

  async getIngredients({
    offset = 0,
    limit = 10,
    order = 'any',
    orderBy = 'relevance',
    ingredientIds = [],
  }: {
    ingredientIds?: Array<number>;
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc' | 'any';
    orderBy?: 'relevance' | 'createdAt';
  }) {
    return getIngredientsBaseQuery(this.db)
      .modify(matchingIngredientIds({ ingredientIds }))
      .modify(
        ingredientQueryOrdering({
          order,
          orderBy,
        }),
      )
      .modify((queryBuilder: Knex.QueryBuilder) => {
        // only use offset/limit if not returning matching ingredientIds
        if (!ingredientIds.length) {
          queryBuilder.offset(offset).limit(limit);
        }
        return queryBuilder;
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

  async searchIngredients(searchString: string, supermarketId: number | null) {
    const rawQuery = this.db.raw(
      `
     (
        SELECT 
          ingredients.id,
          ingredients.name,
          CAST(ingredients.price_per_unit as FLOAT),
          ingredients.supermarket_id
        FROM 
          ingredients
        WHERE 
          position(? in lower(ingredients.name))>0
      ) as ingredients
      `,
      [searchString],
    );

    return this.db
      .select('*')
      .from(rawQuery)
      .modify(this.matchingSupermarketId({ supermarketId }))
      .limit(30);
  }

  async insertIngredient(ingredient: Ingredient) {
    // convert recipe to snake case
    const ingredientSnake = snakeize(ingredient);
    return await this.db.transaction(async (trx) => {
      const {
        name,
        price_per_unit,
        product_id,
        category_id,
        supermarket_id,
        base_value,
        unit,
      } = ingredientSnake;
      // insert ingredient
      const result = await this.db('ingredients')
        .insert(
          {
            name,
            price_per_unit,
            product_id,
            category_id,
            supermarket_id,
            base_value,
            unit,
          },
          ['*'],
        )
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
