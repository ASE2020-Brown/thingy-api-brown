const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const routes = require('./api');
const config = require('./config');
 
async function startServer(){
  const app = new Koa();
  require('./loaders/mongo')(app);
  require('./loaders/bot')(app);
  require('./loaders/mail')(app);
  app
    .use(bodyParser())
    .use(cors())
    .use(routes.sensors)
    .use(routes.security)
    .use(routes.protected);
  server = app.listen(config.port);

  // socket connection
  const options={
    cors:true,
    origins:['http://localhost:8080'],
   };
  const io = require('socket.io')(server, options);
  
  const thingySockets = {
    brown_1: io.of('/brown-1'),
    brown_3: io.of('/brown-3')
  };

  require('./loaders/mqtt')(app, thingySockets);

  thingySockets.brown_1.on('connection', socket => {
    console.log('Brown-1 connected');
  });

  thingySockets.brown_3.on('connection', socket => {
    console.log('Brown-3 connected');
  });

}

startServer();