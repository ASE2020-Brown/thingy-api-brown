const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const routes = require('./api');
const config = require('./config');
 
async function startServer(){
  const app = new Koa();
  require('./loaders/mongo')(app);
  require('./loaders/mqtt')(app);
  app
    .use(bodyParser())
    .use(cors())
    .use(routes.getEnvironment)
    .use(routes.security);
  app.listen(config.port)
}

startServer();