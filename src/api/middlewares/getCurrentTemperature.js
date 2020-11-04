const client = require('../../loaders/mqtt');
let temperatureObject;

client.on('connect', () => {
  console.log('mqtt connection');
  client.subscribe('things/green-3/shadow/update', () => {
    console.log('mqtt suscription');
  });
});

client.on('message', (topic, message) => {
  const messageObject = JSON.parse(message.toString());
  const appId = messageObject.appId;
  if(appId === 'TEMP') {
    temperatureObject = JSON.parse(message.toString());
    client.end();
  }
});

const getCurrentTemperature = async ctx => {
  return ctx.body = {
    id: '1',
    sensor: 'brown-3',
    value: parseFloat(temperatureObject.data),
    units: 'celsius',
    timestamp: temperatureObject.ts
  };
};

module.exports = getCurrentTemperature;