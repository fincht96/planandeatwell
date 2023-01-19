import AppConfig from './configs/app.config';
import knexFile from '../knexfile';
import knex, { Knex } from 'knex';

export const makeDbConnection = (appConfig: AppConfig): Knex => {
  const options = knexFile;
  const db = knex(options);
  db.raw('SELECT 1')
    .then(() => {
      console.log('PostgreSQL connected');
    })
    .catch((e) => {
      console.log('PostgreSQL not connected');
      console.error(e);
    });

  return knex(options);
};
