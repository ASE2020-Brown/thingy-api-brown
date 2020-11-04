const config = require('../config');
const mqtt = require('mqtt');
const options = {
  clientId: 'brown_team_3',
  username: 'brown',
  password: 'eo25706kln',
  port: config.mqttPort
};
const client = mqtt.connect(config.mqttURL, options);

module.exports = client;