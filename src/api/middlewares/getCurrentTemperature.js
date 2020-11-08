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

module.exports.currentTemperature = getCurrentTemperature;
module.exports.shadowUpdate = getShadowUpdate;