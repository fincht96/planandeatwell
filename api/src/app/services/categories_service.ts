import { Knex } from 'knex';
import { toSnakeCase } from '../utils/toSnakeCase';

export default class CategoriesService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async getCategories(orderOptions: {
    orderBy?: 'createdAt';
    order?: 'asc' | 'desc';
  }) {
    const { orderBy, order } = orderOptions;
    return this.db
      .select('*')
      .from('categories')
      .modify((qb) => {
        if (!!orderBy && !!order) {
          qb.orderBy(toSnakeCase(orderBy), order);
        }
      });
  }
}
