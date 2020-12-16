const config = require('../config');
const mqtt = require('mqtt');
const clientInflux = require('./influxdb');
const {Point} = require('@influxdata/influxdb-client');
const Telegraf = require('telegraf');
const bot = new Telegraf(config.telegramToken);
const MongoClient = require('mongodb').MongoClient;

const options = {
  username: config.thingyUser,
  password: config.thingyPass
};

module.exports = function (app, io) {
  const thingyClient = mqtt.connect(config.mqttURL, options);
  app.thingy = thingyClient;
  thingyClient.on('connect', () => {
    thingyClient.subscribe('things/brown-3/shadow/update', () => {
      console.log('Thingy brown-3 suscribed')
    });
    thingyClient.subscribe('things/brown-1/shadow/update', () => {
      console.log('Thingy brown-1 suscribed')
    });
  });

  thingyClient.on('message', (topic, message) => {
    const thingy = topic.split('/')[1];    
    app.message = JSON.parse(message.toString());
    if(app.message.appId === 'BUTTON') {
      console.log('BUTTON');
      io.emit('ALARM', { alarm: true});
      sendMessageUsersByThingy(thingy);
    }
    if(app.message.appId === 'TEMP') {
      console.log(thingy);
      console.log(JSON.parse(message.toString()));
      app.temperature = JSON.parse(message.toString());
      const writeApi = clientInflux.getWriteApi(config.influxOrg, config.influxBucket);
      writeApi.useDefaultTags({sensor: topic.split('/')[1]})

      const point = new Point('temperature')
        .floatField('degree', parseFloat(app.temperature.data))
      writeApi.writePoint(point)
      writeApi
          .close()
          .then(() => {
              console.log('Data inserted')
          })
          .catch(e => {
              console.error(e)
          });
    }
  });
};

async function sendMessageUsersByThingy(thingy) {
  const client = await MongoClient.connect(config.mongodbURL, { useUnifiedTopology: true });
  const db = client.db(config.mongodbName);
  const users = db.collection('users');
  const userDB = await users.findOne(
    {'sensor': thingy} 
  );
  if (!userDB) {
    return false
  }
  userDB.chat_id.forEach( id => {
    bot.telegram.sendMessage(id, "Alarm");
  });
}