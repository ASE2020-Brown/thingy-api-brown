const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = function (app) {
  app.mailer = nodemailer.createTransport({
    host: config.mailHost,
    port: 465,
    secure: true,
    auth: {
      user: config.mailUser,
      pass: config.mailPass
    }
  });
};