const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const routes = require('./api');
const config = require('./config');
 
async function startServer(){
  const app = new Koa();
  require('./loaders/mongo')(app);
  app
    .use(bodyParser())
    .use(cors())
    .use(routes.getEnvironment)
    .use(routes.security);
  server = app.listen(config.port);

  // socket connection
  const options={
    cors:true,
    origins:['http://localhost:8080'],
   };
  const io = require('socket.io')(server, options);
  require('./loaders/mqtt')(app, io);
  io.on('connection', (socket) => {
    console.log('Socket created')
  });
}

startServer();