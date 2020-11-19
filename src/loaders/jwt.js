const jwt = require('koa-jwt');
const config = require('../config');
const jwtInstance = jwt({secret: config.jwtSecret});
const jsonwebtoken = require('jsonwebtoken');
const asyncRedis = require("async-redis");
const asyncRedisClient = asyncRedis.createClient();

function JWTErrorHandler(ctx, next) {
  return next().catch(err => {
    if(401 === err.status) {
      ctx.status = 401,
      ctx.body = {
        'error': 'Not authorized'
      } 
    } else {
      throw err;
    }
  });
}

async function searchJWTinRedis(ctx){
  if (!(ctx.request.headers.authorization && ctx.request.headers.authorization.split(' ')[0] === 'Bearer')) 
    return false;
  const token = ctx.request.headers.authorization.split(' ')[1];
  const jwtPayload = jsonwebtoken.verify(token, config.jwtSecret);
  const reply = await asyncRedisClient.get(jwtPayload.jti);
  if(reply === null ) return false;
  else return true
}

async function validateJTI(ctx, next){
  const existsJTI = await searchJWTinRedis(ctx);
  if(existsJTI) return next();
  else {
    ctx.status = 401,
    ctx.body = {
      'error': 'Not authorized'
    }
  }
}

module.exports.jwt = () => jwtInstance;
module.exports.errorHandler = () => JWTErrorHandler;
module.exports.validateJTI = () => validateJTI;
module.exports.issue = payload => {
  return jsonwebtoken.sign(payload, config.jwtSecret);
};
module.exports.verify = token => {
  return jsonwebtoken.verify(token, config.jwtSecret);
};