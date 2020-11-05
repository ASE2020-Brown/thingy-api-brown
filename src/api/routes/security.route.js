const Router = require('koa-router');
const router = new Router();
const securedRouter = new Router();
const jwt = require('../../loaders/jwt');
const security = require('../middlewares/security.middleware');

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

router.post('/login', security.login);
router.post('/register', security.register);

module.exports = router.middleware();