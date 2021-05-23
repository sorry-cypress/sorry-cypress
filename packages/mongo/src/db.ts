import type { Instance, Project, Run, RunTimeout } from '@sorry-cypress/common';
import mongodb, { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import {
  MONGODB_AUTH_MECHANISM,
  MONGODB_DATABASE,
  MONGODB_PASSWORD,
  MONGODB_URI,
  MONGODB_USER,
} from './config';
import { CollectionName } from './types';

let db: mongodb.Db;
let client: MongoClient;

export const initMongo = async () => {
  await initMongoNoIndexes();
  createIndexes();
};

export const initMongoNoIndexes = async () => {
  if (client && db) {
    return;
  }
  const options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (MONGODB_AUTH_MECHANISM != undefined) {
    options.authMechanism = MONGODB_AUTH_MECHANISM;
    options.auth = { user: MONGODB_USER, password: MONGODB_PASSWORD };
  }

  client = await MongoClient.connect(MONGODB_URI, options);
  db = client.db(MONGODB_DATABASE);
  console.log('🥬 Created MongoDB client');
};

export const getMongoDB = () => db;
export const Collection = {
  run: getCollection<Run>('runs'),
  project: getCollection<Project>('projects'),
  instance: getCollection<Instance>('instances'),
  runTimeout: getCollection<RunTimeout>('runTimeouts'),
};
export { ObjectId };
function getCollection<T>(name: CollectionName) {
  return () => db.collection<T>(name);
}

function createIndexes() {
  Collection.run().createIndex({ runId: 1 }, { unique: true });
  Collection.run().createIndex({ 'meta.commit.message': 1 });
  Collection.run().createIndex({ 'meta.ciBuildId': 1 });

  Collection.instance().createIndex({ instanceId: 1 }, { unique: true });
  Collection.project().createIndex({ projectId: 1 }, { unique: true });
  Collection.runTimeout().createIndex({ timeoutAfter: 1 }, { unique: false });
}
