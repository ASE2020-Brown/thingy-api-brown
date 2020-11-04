const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = dotenv.config();
if(envFile.error) throw new Error('There is not .env file');

module.exports = {
  mongodbURL: process.env.MONGO_URL,
  mongodbName: process.env.MONGO_DB,
  port: parseInt(process.env.PORT),
  api: {
    prefix: '/api',
  }
};