const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = dotenv.config();
if(envFile.error) throw new Error('There is not .env file');

module.exports = {
  mongodbURL: process.env.MONGO_URL,
  mongodbName: process.env.MONGO_DB,
  port: parseInt(process.env.PORT),
  mqttURL: process.env.MQTT_URL,
  mqttPort: process.env.MQTT_PORT,
  jwtSecret: process.env.JWT_SECRET,
  cryptoSecret: process.env.CRYPTO_SECRET,
  thingyUser: process.env.THINGY_USER,
  thingyPass: process.env.THINGY_PASS,
  influxToken: process.env.INFLUX_TOKEN,
  influxOrg: process.env.INFLUX_ORG,
  influxBucket: process.env.INFLUX_BUCKET,
  influxURL: process.env.INFLUX_URL,
  telegramToken: process.env.TELEGRAM_TOKEN,
  api: {
    prefix: '/api',
  }
};