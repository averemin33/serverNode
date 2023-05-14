import { Sequelize } from 'sequelize';
import config from 'config';

export const sequelize = new Sequelize(
  config.get('name'),
  config.get('user'),
  config.get('password'),
  {
    dialect: 'postgres',
    host: config.get('host'),
    port: config.get('port')
  }
);
