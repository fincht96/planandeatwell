import { Knex } from 'knex';

export default class EmailService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async findOne(email: string) {
    try {
      const found = await this.db('emails')
        .select('*')
        .where('email', email)
        .first();

      console.log('found', found);
      return {
        result: found,
        error: false
      };
    } catch (e) {
      return {
        result: null,
        error: true
      };
    }
  }

  async insertEmail(email: string) {
    try {
      await this.db('emails').insert({ email }).returning('*');
      return {
        error: false
      };
    } catch (e) {
      return {
        error: true
      };
    }
  }
}
