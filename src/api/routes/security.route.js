const Router = require('koa-router');
const router = new Router();
const securedRouter = new Router();
const jwt = require('../../loaders/jwt');
//const getUser = require('../middlewares/getUser');
const login = require('../middlewares/login');

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

//securedRouter.get('/user/:userId', getUser);
router.post('/login', login);

module.exports = router.middleware();