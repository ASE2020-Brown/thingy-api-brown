const jwt = require('../../loaders/jwt');

const login = async ctx => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;

  if(username === 'user' && password === 'pwd'){
    ctx.body = {
      token: jwt.issue({
        user: 'user',
        role: 'admin'
      })
    };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid login'};
  }
};

module.exports = login;