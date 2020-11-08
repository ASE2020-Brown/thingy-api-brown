const config = require('../config');
const mqtt = require('mqtt');
const options = {
  username: config.thingyUser,
  password: config.thingyPass
};

module.exports = function (app) {
  thingy.message = {
    appId: ''
  };
  const thingyClient = mqtt.connect(config.mqttURL, options);
  thingyClient.on('connect', () => {
    thingyClient.subscribe('things/brown-3/shadow/update', () => {
      console.log('Thingy suscribed')
    });
  });

  thingyClient.on('message', (topic, message) => {
    thingy.message = JSON.parse(message.toString());
    app.message = JSON.parse(message.toString());
    if(thingy.message.appId === 'BUTTON') {
      console.log('BUTTON');
    }
    if(thingy.message.appId === 'TEMP') {
      app.temperature = JSON.parse(message.toString());
    }
  });
};