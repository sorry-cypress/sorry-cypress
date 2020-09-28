import mongodb from 'mongodb';
import { MONGODB_URI, MONGODB_DATABASE } from '@src/config';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  client = await mongodb.connect(MONGODB_URI, { useNewUrlParser: true });
  console.log('Successfully connected to MongoDB server');

  db = client.db(MONGODB_DATABASE);

  db.collection('runs').createIndex({ runId: 1 }, { unique: true });
  db.collection('instances').createIndex({ instanceId: 1 }, { unique: true });
  db.collection('projects').createIndex({ projectId: 1 }, { unique: true });
};

export const getMongoDB = () => db;
