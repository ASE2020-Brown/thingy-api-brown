const ObjectID = require('mongodb').ObjectID;

const getCurrentTemperature = async ctx => {
  return ctx.body = {
    id: '1',
    sensor: 'thingy-brown3',
    value: 7,
    units: 'celsius',
    timestamp: '2020-11-03T20:38:22.393Z'
  };
};

module.exports = getCurrentTemperature;