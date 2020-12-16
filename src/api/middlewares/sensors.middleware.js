const clientInflux = require('../../loaders/influxdb');
const config = require('../../config');

const getCurrentTemperature = async ctx => {
  const queryApi = clientInflux.getQueryApi(config.influxOrg);
  const fluxQuery = 'from(bucket: "' + config.influxBucket + '") |> range(start: -5m) ' +
    '|> filter(fn: (r) => r._measurement == "temperature" and r.sensor == "' + ctx.params.sensorId + '") ' +
    '|> last() ' +
    '';
  let lastTemperature = await queryApi.collectRows(fluxQuery);

  console.log('lastTemperature', lastTemperature)

  if(typeof lastTemperature === undefined) {
      ctx.status = 401;
      ctx.body = { error: 'Not signal from thingy'};
      return;
  }
  return ctx.body = {
    sensor: lastTemperature[0].sensor,
    value: parseFloat(lastTemperature[0]._value),
    units: 'celsius',
    time: lastTemperature[0]._time
  };
};

const getTemperatureLog = async ctx => {
  const queryApi = clientInflux.getQueryApi(config.influxOrg);
  const fluxQuery = 'from(bucket: "' + config.influxBucket + '") |> range(start: -30m) ' +
    '|> filter(fn: (r) => r._measurement == "temperature" and r.sensor == "' + ctx.params.sensorId + '")';
  let temperatureLog = await queryApi.collectRows(fluxQuery);

  console.log('temperatureLog', temperatureLog)

  if(typeof temperatureLog === undefined) {
      ctx.status = 401;
      ctx.body = { error: 'Not signal from thingy'};
      return;
  }
  return ctx.body = temperatureLog;
};

const getShadowUpdate = async ctx => {
  if(!ctx.app.message) {
    ctx.status = 404;
    ctx.body = { error: 'Not signal from thingy'};
    return;
  }
  return ctx.body = ctx.app.message;
};

const setUpdateAccepted = async ctx => {
  if(!ctx.app.thingy) {
    ctx.status = 401;
    ctx.body = { error: 'Not signal from thingy'};
    return;
  } else {
    ctx.app.thingy.subscribe('things/' + ctx.request.body.sensor + '/shadow/update/accepted', (err) => {
      if (!err) {
        ctx.app.thingy.publish('things/' + ctx.request.body.sensor + '/shadow/update/accepted', 
        '{"appId":"LED","data":{"color":"00ff00"},"messageType":"CFG_SET"}');
        setTimeout(() => {
          ctx.app.thingy.publish('things/'+ ctx.request.body.sensor + '/shadow/update/accepted', 
          '{"appId":"LED","data":{"color":"ff0000"},"messageType":"CFG_SET"}');
        }, 6000)
      }
    })
    console.log('ctx.request.body.sensorId',ctx.request.body.sensor);
  }
  return ctx.body = {
    msg: 'Help informed'
  };
};

module.exports.currentTemperature = getCurrentTemperature;
module.exports.shadowUpdate = getShadowUpdate;
module.exports.updateAccepted = setUpdateAccepted;
module.exports.temperatureLog = getTemperatureLog;