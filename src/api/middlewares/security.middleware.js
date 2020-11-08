const jwt = require('../../loaders/jwt');
const config = require('../../config');
const crypto = require('crypto');

const login = async ctx => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;

  userDB = await ctx.app.users.findOne(
    {'username': username},
    { projection: {_id:0} }
  );
  if (!userDB) {
    ctx.status = 401;
    ctx.body = { error: 'User not found'};
    return
  }
  const hashPassword = crypto.createHmac('sha256', config.cryptoSecret)
                   .update(password)
                   .digest('hex');
  if(username === userDB.username && hashPassword === userDB.password){
    ctx.body = {
      token: jwt.issue({
        user: username,
        role: 'user'
      })
    };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid login'};
  }
};

const register = async ctx => {
  let user = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }

  if (!user.username) ctx.throw(400, {'error': '"username" is a required field'});
  if (!user.password) ctx.throw(400, {'error': '"username" is a required field'});
  if(await userExist(ctx, user.username)) {
    ctx.status = 401;
    ctx.body = { error: 'Username exists'};
    return;
  }
  
  const hashPassword = crypto.createHmac('sha256', config.cryptoSecret)
                   .update(user.password)
                   .digest('hex');
  user.password = hashPassword;

  ctx.body = await ctx.app.users.insertOne(user);
};

async function userExist(ctx, username){  
  let existingUser = await ctx.app.users.findOne(
    {'username': username},
    { projection: {_id:0} }
  );
  return new Promise((resolve) => {
    if(existingUser) resolve(true);
    else resolve(false);
  });
}

module.exports.login = login;
module.exports.register = register;