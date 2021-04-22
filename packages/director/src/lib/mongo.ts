import * as config from '@src/config';
import mongodb, { MongoClientOptions } from 'mongodb';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  const options: MongoClientOptions = {
    useNewUrlParser: true,
  };

  if (config.MONGODB_AUTH_MECHANISM != undefined) {
    options.authMechanism = config.MONGODB_AUTH_MECHANISM;
    options.auth = {
      user: config.MONGODB_USER,
      password: config.MONGODB_PASSWORD,
    };
  }

  client = await mongodb.connect(config.MONGODB_URI, options);
  console.log('Successfully connected to MongoDB server');

  db = client.db(config.MONGODB_DATABASE);

  db.collection('runs').createIndex(
    { runId: 1 },
    { unique: true, ...getIndexTTLOption(config.MONGO_RUNS_TTL_SECONDS) }
  );
  db.collection('instances').createIndex(
    { instanceId: 1 },
    { unique: true, ...getIndexTTLOption(config.MONGO_INSTANCES_TTL_SECONDS) }
  );
  db.collection('projects').createIndex(
    { projectId: 1 },
    { unique: true, ...getIndexTTLOption(config.MONGO_PROJECTS_TTL_SECONDS) }
  );
};

export const getMongoDB = () => db;

const getIndexTTLOption = (explicitValue: number) => {
  if (explicitValue) {
    console.log({ expireAfterSeconds: explicitValue });
    return { expireAfterSeconds: explicitValue };
  }
  if (config.MONGO_COLLECTIONS_TTL_SECONDS) {
    return { expireAfterSeconds: config.MONGO_COLLECTIONS_TTL_SECONDS };
  }
  return {};
};
