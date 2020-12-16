const config = require('../../config');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports =  async (app) => {
  const client = await MongoClient.connect(config.mongodbURL, { useUnifiedTopology: true });
  const db = client.db(config.mongodbName);
  const users = db.collection('users');
  const userDB = await users.findOne(
    {'sensor': app.nameThingy} 
  );
  if (!userDB) {
    return false
  }
  let userID = {"_id": ObjectID(userDB._id)};
  userDB.chat_id.push(app.chat_id)
  let valuesToUpdate = {
    $set: {
      chat_id: userDB.chat_id
    }
  };

  const result = await users.updateOne(userID, valuesToUpdate);
  return true
  /*
  MongoClient.connect(config.mongodbURL, { useUnifiedTopology: true })
    .then(async client => {
      const db = client.db(config.mongodbName);
      users = db.collection('users');
      userDB = await users.findOne(
        {'sensor': app.nameThingy} 
      );
      if (!userDB) {
        return
      }
      let userID = {"_id": ObjectID(userDB._id)};
      let valuesToUpdate = {
        $set: app.chat
      };
    
      await users.updateOne(userID, valuesToUpdate);
    })
    .catch(err => console.error(err));*/
};