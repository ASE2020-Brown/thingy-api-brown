const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./api');
const config = require('./config');

async function startServer(){
  const app = new Koa();
  require('./loaders/mongo')(app);
  app.use(bodyParser());
  app.use(routes.getEnvironment);
  app.use(routes.login);
  app.listen(config.port)
}

startServer();
