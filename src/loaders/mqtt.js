const config = require('../config');
const mqtt = require('mqtt');
const options = {
  username: config.thingyUser,
  password: config.thingyPass
};

module.exports = function (app, io) {
  const thingyClient = mqtt.connect(config.mqttURL, options);
  thingyClient.on('connect', () => {
    thingyClient.subscribe('things/brown-3/shadow/update', () => {
      console.log('Thingy suscribed')
    });
  });

  thingyClient.on('message', (topic, message) => {
    app.message = JSON.parse(message.toString());
    if(app.message.appId === 'BUTTON') {
      console.log('BUTTON');
      io.emit('ALARM', { alarm: true})
    }
    if(app.message.appId === 'TEMP') {
      app.temperature = JSON.parse(message.toString());
    }
  });
};