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
  matchingSupermarketId,
} from '../utils/ingredientsQueryBuilder';
import FetchService from './fetch_service';
import RecipeService from './recipe_service';
import MealPlanService from './meal_plan_service';

export default class IngredientsService {
  private db: Knex;
  constructor(
    db: Knex,
    private fetchService: FetchService,
    private recipeService: RecipeService,
    private mealPlanService: MealPlanService,
  ) {
    this.db = db;
  }

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
      .modify(matchingSupermarketId({ supermarketId }))
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

  async updateIngredientPrices(supermarketId: number) {
    // get latest ingredient prices
    const productIdListResult = await this.db
      .select('product_id')
      .from('ingredients')
      .where('supermarket_id', supermarketId);

    const productIdsAndPricePerUnit =
      await this.fetchService.fetchIngredientPrices(
        supermarketId,
        productIdListResult.map((row) => row.product_id),
      );

    // update all ingredient prices
    await this.db.transaction((trx) => {
      const queries = productIdsAndPricePerUnit.map(
        ({
          productId,
          pricePerUnit,
        }: {
          productId: string;
          pricePerUnit: number;
        }) =>
          this.db('ingredients')
            .where('product_id', productId)
            .update({
              price_per_unit: pricePerUnit,
              updated_at: this.db.fn.now(),
            })
            .transacting(trx),
      );
      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });

    // update all recipe metrics
    await this.recipeService.updateRecipeMetrics();

    // update all meal plan metrics
    await this.mealPlanService.updateMealPlanMetrics();
  }
}
