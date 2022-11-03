import { Knex } from 'knex';

export default class RecipeService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(includeIngredients: boolean = false) {
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

    const found = includeIngredients
      ? await this.db.select('*').from(rawQuery)
      : await this.db('recipes').select('*');

    return found;
  }
}
