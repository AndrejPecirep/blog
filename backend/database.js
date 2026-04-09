const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
const useSsl = process.env.DB_SSL === 'true' || isProduction;

const databaseUrl = process.env.DATABASE_URL;

const commonConfig = {
  dialect: 'postgres',
  logging: false,
};

if (useSsl) {
  commonConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, commonConfig)
  : new Sequelize(
      process.env.DB_NAME || 'blogdb',
      process.env.DB_USER || 'bloguser',
      process.env.DB_PASSWORD || 'blogpass',
      {
        ...commonConfig,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
      }
    );

module.exports = sequelize;
