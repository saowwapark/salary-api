import mysqlPromise from 'mysql2/promise';
import { serverConfigData } from './server.config';

const dbEnv = serverConfigData.dbEnv;

const dbGeneralConfig = {
  host: dbEnv?.dbHost,
  port: Number(dbEnv?.dbPort),
  user: dbEnv?.dbUserName,
  password: dbEnv?.dbPassword,
}

const dynamicDbConfig = {
  ...dbGeneralConfig,
  connectTimeout: 100000,
  connectionLimit: 30,
  queueLimit: 10000
};

export const dbPool = mysqlPromise.createPool(dynamicDbConfig);
