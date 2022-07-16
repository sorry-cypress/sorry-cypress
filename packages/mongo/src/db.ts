import type { Instance, Project, Run, RunTimeout } from '@sorry-cypress/common';
import mongodb, { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import {
  MONGODB_AUTH_MECHANISM,
  MONGODB_DATABASE,
  MONGODB_PASSWORD,
  MONGODB_TLS,
  MONGODB_URI,
  MONGODB_USER,
} from './config';
import { CollectionName } from './types';

let db: mongodb.Db;
let client: MongoClient;

export const initMongo = async () => {
  try {
    // 👹 Wait for mongoDB to initialize, didn't want to mess with ECS health checks
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await initMongoNoIndexes();
    await createIndexes();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
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
    if (!MONGODB_USER) {
      throw new Error(
        'MONGODB_USER is required when MONGODB_AUTH_MECHANISM is set'
      );
    }
    if (!MONGODB_PASSWORD) {
      throw new Error(
        'MONGODB_PASSWORD is required when MONGODB_AUTH_MECHANISM is set'
      );
    }
    options.authMechanism = MONGODB_AUTH_MECHANISM;
    options.auth = { user: MONGODB_USER, password: MONGODB_PASSWORD };
  }

  client = await MongoClient.connect(MONGODB_URI, {
    ...options,
    tls: MONGODB_TLS === 'true',
  });
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

async function createIndexes() {
  await Promise.all([
    Collection.run().createIndex({ runId: 1 }, { unique: true }),
    Collection.run().createIndex({ 'meta.commit.message': 1 }),
    Collection.run().createIndex({ 'meta.ciBuildId': 1 }),

    // for aggregations on runs (/[projectId]/runs)
    Collection.run().createIndex({
      'meta.projectId': 1,
      _id: 1,
    }),

    // for aggregations on runs (/[projectId]/runs/[ciBuildId])
    Collection.run().createIndex({
      'meta.projectId': 1,
      'meta.ciBuildId': 1,
      _id: 1,
    }),

    Collection.instance().createIndex({ instanceId: 1 }, { unique: true }),
    Collection.instance().createIndex({ runId: 1 }),
    Collection.project().createIndex({ projectId: 1 }, { unique: true }),
    Collection.runTimeout().createIndex({ timeoutAfter: 1 }, { unique: false }),
  ]);
}

export const isMongoDBHealthy = async (): Promise<boolean> => {
  try {
    const mongoResponse = await getMongoDB().command({ ping: 1 });
    return mongoResponse.ok === 1;
  } catch (e) {
    console.error(`Error while pinging MongoDB : ${e}`);
    return false;
  }
};
