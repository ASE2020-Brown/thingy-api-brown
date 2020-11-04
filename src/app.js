const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./api');
const config = require('./config');

async function startServer(){
  const app = new Koa();

  app.use(bodyParser());
  app.use(routes);
  app.listen(config.port)
}

startServer();