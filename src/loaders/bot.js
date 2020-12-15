const config = require('../config');
const Telegraf = require('telegraf');
const bot = new Telegraf(config.telegramToken);
const botMiddleware = require('../api/middlewares/bot.middleware');

module.exports = function (app) {
  bot.start((ctx) => {
    ctx.reply('Hi ' + ctx.from.first_name + '. Welcome to Grandpa Care. Type /help to view more');
    console.log('ctx: ', ctx.update.message.message_id);  
  });
  
  bot.help((ctx) => {
    ctx.reply('Do you want to receive alert messages? \nRegister your thingy with /thingy/your_thingy_code');
  });
  
  bot.on('text', async (ctx) => {
    let prefixThingy = ctx.update.message.text.substring(0, 8);
    if(prefixThingy === '/thingy/') {
      app.nameThingy = ctx.update.message.text.substring(8, ctx.update.message.text.length);
      app.chat = {
        chat_id: ctx.chat.id
      };
      botMiddleware(app);
    }
  });
  
  bot.launch();
};