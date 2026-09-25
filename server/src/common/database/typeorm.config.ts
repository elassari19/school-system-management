import { DataSource, DataSourceOptions } from 'typeorm';
import * as entities from '../entities';

const entitiesArray = Object.values(entities);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: entitiesArray,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/common/database/migrations/*.ts'],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);