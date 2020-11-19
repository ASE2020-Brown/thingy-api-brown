const getCurrentTemperature = async ctx => {
  if(!ctx.app.temperature) {
      ctx.status = 401;
      ctx.body = { error: 'Not signal from thingy'};
      return;
  }
  return ctx.body = {
    id: '1',
    sensor: 'brown-3',
    value: parseFloat(ctx.app.temperature.data),
    units: 'celsius',
    timestamp: ctx.app.temperature.ts
  };
};

const getShadowUpdate = async ctx => {
  if(!ctx.app.message) {
    ctx.status = 401;
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
    ctx.app.thingy.subscribe('things/brown-3/shadow/update/accepted', (err) => {
      if (!err) {
        ctx.app.thingy.publish('things/brown-3/shadow/update/accepted', 
        '{"appId":"LED","data":{"color":"00ff00"},"messageType":"CFG_SET"}');
        setTimeout(() => {
          ctx.app.thingy.publish('things/brown-3/shadow/update/accepted', 
          '{"appId":"LED","data":{"color":"ff0000"},"messageType":"CFG_SET"}');
        }, 60000)
      }
    })
  }
  return ctx.body = {
    msg: 'Help informed'
  };
};

module.exports.currentTemperature = getCurrentTemperature;
module.exports.shadowUpdate = getShadowUpdate;
module.exports.updateAccepted = setUpdateAccepted;