const config = require('../config');
const mqtt = require('mqtt');
const options = {
  username: 'brown',
  password: 'eo25706kln'
};
const client = mqtt.connect(config.mqttURL, options);

module.exports = client;