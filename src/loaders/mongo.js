const config = require('../config');

const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {
  MongoClient.connect(config.mongodbURL)
    .then(client => {
      const db = client.db(config.mongodbName);
      console.log("Database connection established");
    })
    .catch(err => console.error(err))
};