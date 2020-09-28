import mongodb, { MongoClient } from 'mongodb';
import { MONGODB_URI, MONGODB_DATABASE } from '@src/config';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log('Successfully connected to MongoDB server');

  db = client.db(MONGODB_DATABASE);

  db.collection('runs').createIndex({ runId: 1 }, { unique: true });
  db.collection('instances').createIndex({ instanceId: 1 }, { unique: true });
  db.collection('runs').createIndex({ createdAt: 1 });
  db.collection('runs').createIndex({ 'meta.commit.branch': 1 });
};

export const getMongoDB = () => db;
