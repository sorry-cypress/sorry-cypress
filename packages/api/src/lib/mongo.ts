import mongodb, { MongoClient } from 'mongodb';
import { MONGODB_URI, MONGODB_DATABASE } from '@src/config';

export { ObjectID } from 'mongodb';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }
  client = new MongoClient(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongodb_sorry_cypress:27017/`
  );
  console.log('Successfully connected to MongoDB server');

  db = client.db(MONGODB_DATABASE);

  db.collection('runs').createIndex({ runId: 1 }, { unique: true });
  db.collection('instances').createIndex({ instanceId: 1 }, { unique: true });
};

export const getMongoDB = () => db;
