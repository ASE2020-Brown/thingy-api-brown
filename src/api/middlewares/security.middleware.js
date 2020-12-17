const jwt = require('../../loaders/jwt');
const config = require('../../config');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const redis = require("redis");
const rediscl = redis.createClient();
const ObjectID = require('mongodb').ObjectID;

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
    let jti = uuidv4();
    let refresh_token = jwt.issue({
      user: username,
      role: 'admin',
      jti: jti
    });
    rediscl.set(jti, JSON.stringify({
      token: refresh_token,
      }),
      rediscl.print
    );
    ctx.body = {
      token: refresh_token
    };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid login'};
  }
};

const register = async ctx => {
  let user = {
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    sensor: ctx.request.body.sensor,
    chat_id: []
  }

  if (!user.username) ctx.throw(400, {'error': '"username" is a required field'});
  if (!user.password) ctx.throw(400, {'error': '"password" is a required field'});
  if (!user.sensor) ctx.throw(400, {'error': '"sensor" is a required field'});
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

const logout = async ctx => {
  if (ctx.request.headers.authorization && ctx.request.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = ctx.request.headers.authorization.split(' ')[1];
    const jwtPayload = jwt.verify(token);
    rediscl.del(jwtPayload.jti);
    ctx.body = {
      jti: jwtPayload.jti
    };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid login'};
  }
};

const profile = async ctx => {
  return ctx.body = await ctx.app.users.findOne(
    {'username': ctx.params.userId},
    { projection: {_id:0, password:0} }
  );
};

const invite = async ctx => {
  const mailOptions = {
    from: config.mailUser,
    to: ctx.request.body.to,
    subject: ctx.request.body.subject,
    text: ctx.request.body.text
  };

  try {
    await ctx.app.mailer.sendMail(mailOptions);
    ctx.status = 200;
    ctx.body = { msg: 'Email sent'};
  } catch (error) {
    ctx.status = 401;
    ctx.body = { msg: 'Email error'};
  }
};

async function deleteUser(ctx) {
  let userDB = await ctx.app.users.findOne(
    {'username': ctx.request.body.username}
  );
  if (!userDB) {
    return false
  }
  let userID = {"_id": ObjectID(userDB._id)};

  ctx.body = await ctx.app.users.deleteOne(userID);
}

async function updateUser(ctx) {
  let userDB = await ctx.app.users.findOne(
    {'username': ctx.request.body.username}
  );
  if (!userDB) {
    return false
  }
  let userID = {"_id": ObjectID(userDB._id)};
  let valuesToUpdate = {
    $set: ctx.request.body
  };

  await ctx.app.users.updateOne(userID, valuesToUpdate);
  ctx.body = await ctx.app.users.findOne(userID);
}

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;
module.exports.profile = profile;
module.exports.invite = invite;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;