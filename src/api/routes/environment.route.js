const Router = require('koa-router');
const securedRouter = new Router();
const environment = require('../middlewares/getCurrentTemperature');
const jwt = require('../../loaders/jwt');

securedRouter.use(jwt.validateJTI()).use(jwt.errorHandler()).use(jwt.jwt());
securedRouter.get('/temperature/:sensorId', environment.currentTemperature);
securedRouter.get('/connected/:sensorId', environment.shadowUpdate);

module.exports = securedRouter.middleware();