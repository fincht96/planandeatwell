import AppConfig from './configs/app.config';
import knexFile from '../knexfile';
import knex, { Knex } from 'knex';

export const makeDbConnection = (appConfig: AppConfig): Knex => {
  const options = knexFile[`${appConfig.environment}`];
  return knex(options);
};
