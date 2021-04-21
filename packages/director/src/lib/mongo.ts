import mongodb, { MongoClientOptions } from 'mongodb';
import {
  MONGODB_AUTH_MECHANISM,
  MONGODB_DATABASE,
  MONGODB_PASSWORD,
  MONGODB_URI,
  MONGODB_USER,
  RUNS_TTL_OPTIONS,
  INSTANCES_TTL_OPTIONS,
  PROJECTS_TTL_OPTIONS
} from '@src/config';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  const options: MongoClientOptions = {
    useNewUrlParser: true,
  };

  if (MONGODB_AUTH_MECHANISM != undefined) {
    options.authMechanism = MONGODB_AUTH_MECHANISM;
    options.auth = { user: MONGODB_USER, password: MONGODB_PASSWORD };
  }

  client = await mongodb.connect(MONGODB_URI, options);
  console.log('Successfully connected to MongoDB server');

  db = client.db(MONGODB_DATABASE);

  db.collection('runs').createIndex({ runId: 1 }, { unique: true, ...RUNS_TTL_OPTIONS });
  db.collection('instances').createIndex({ instanceId: 1 }, { unique: true, ...INSTANCES_TTL_OPTIONS });
  db.collection('projects').createIndex({ projectId: 1 }, { unique: true, ...PROJECTS_TTL_OPTIONS });
};

export const getMongoDB = () => db;
