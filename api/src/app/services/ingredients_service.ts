import { Knex } from 'knex';

export default class IngredientsService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
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

    try {
      const result = await this.db.select('*').from(rawQuery);
      return {
        result: result,
        error: false,
      };
    } catch (e) {
      return {
        result: null,
        error: true,
      };
    }
  }
}
