const Router = require('koa-router');
const router = new Router();
const environment = require('../middlewares/getCurrentTemperature');

router.get('/temperature/:sensorId', environment.currentTemperature);
router.get('/connected/:sensorId', environment.shadowUpdate);

module.exports = router.middleware();