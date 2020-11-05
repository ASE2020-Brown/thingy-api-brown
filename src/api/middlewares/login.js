const jwt = require('../../loaders/jwt');
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
  if(username === userDB.username && password === userDB.password){
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

module.exports = login;