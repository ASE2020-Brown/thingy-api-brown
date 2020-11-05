const client = require('../../loaders/mqtt');
let temperatureObject;
let shadowUpdateObject;

client.on('connect', () => {
  console.log('mqtt connection');
  client.subscribe('things/brown-3/shadow/update', () => {
    console.log('mqtt suscription');
  });
});

client.on('message', (topic, message) => {
  const messageObject = JSON.parse(message.toString());
  const appId = messageObject.appId;

  shadowUpdateObject = messageObject;
  if(appId === 'TEMP') {
    temperatureObject = JSON.parse(message.toString());
    //client.end();
  }
});

const getCurrentTemperature = async ctx => {
  if(!temperatureObject) {
      ctx.status = 401;
      ctx.body = { error: 'Not signal from thingy'};
      return;
  }
  return ctx.body = {
    id: '1',
    sensor: 'brown-3',
    value: parseFloat(temperatureObject.data),
    units: 'celsius',
    timestamp: temperatureObject.ts
  };
};

const getShadowUpdate = async ctx => {
  if(!shadowUpdateObject) {
    ctx.status = 401;
    ctx.body = { error: 'Not signal from thingy'};
    return;
  }
  return ctx.body = shadowUpdateObject;
};

module.exports.currentTemperature = getCurrentTemperature;
module.exports.shadowUpdate = getShadowUpdate;