const Router = require('koa-router');
const router = new Router();
const securedRouter = new Router();
const jwt = require('../../loaders/jwt');
const security = require('../middlewares/security.middleware');

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

router.post('/login', security.login);
router.post('/register', security.register);
securedRouter.post('/logout', security.logout);
securedRouter.get('/profile/:userId', security.profile);

module.exports.public = router.middleware();
module.exports.protected = securedRouter.middleware();