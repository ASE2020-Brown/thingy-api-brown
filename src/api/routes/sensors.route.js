const Router = require('koa-router');
const securedRouter = new Router();
const environment = require('../middlewares/sensors.middleware');
const jwt = require('../../loaders/jwt');

securedRouter.use(jwt.validateJTI()).use(jwt.errorHandler()).use(jwt.jwt());
securedRouter.get('/temperature/:sensorId', environment.currentTemperature);
securedRouter.get('/connected/:sensorId', environment.shadowUpdate);
securedRouter.post('/helpyou/:sensorId', environment.updateAccepted);

module.exports = securedRouter.middleware();