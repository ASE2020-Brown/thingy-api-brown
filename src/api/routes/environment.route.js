const Router = require('koa-router');
const router = new Router();
const getcurrentTemperature = require('../middlewares/getCurrentTemperature');

router.get('/temperature/:sensorId', getcurrentTemperature);

module.exports = router.middleware();