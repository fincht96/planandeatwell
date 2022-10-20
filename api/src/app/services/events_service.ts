import { Knex } from 'knex';

export default class EventsService {
  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  async insert(event_type: string, event_name: string, event_message: string) {
    try {
      await this.db('events')
        .insert({ event_type, event_name, event_message })
        .returning('*');

      return {
        error: false,
      };
    } catch (e) {
      return {
        error: true,
      };
    }
  }
}
