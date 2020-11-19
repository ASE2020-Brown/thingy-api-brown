const config = require('../config');

const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {
  MongoClient.connect(config.mongodbURL, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db(config.mongodbName);
      app.users = db.collection('users');
      console.log("Database connection established");
    })
    .catch(err => console.error(err))
};