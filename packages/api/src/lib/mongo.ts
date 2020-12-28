import { MONGODB_DATABASE, MONGODB_URI } from '@src/config';
import mongodb from 'mongodb';

export { ObjectID } from 'mongodb';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  client = await mongodb.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Successfully connected to MongoDB server');

  db = client.db(MONGODB_DATABASE);

  db.collection('runs').createIndex({ runId: 1 }, { unique: true });
  db.collection('instances').createIndex({ instanceId: 1 }, { unique: true });
  db.collection('projects').createIndex({ projectId: 1 }, { unique: true });
};

export const getMongoDB = () => db;
