import mongodb from 'mongodb';

const url = 'mongodb://mongo:27017';
const dbName = 'sorry-cypress';

let db: mongodb.Db;
let client: mongodb.MongoClient;

export const init = async () => {
  if (db && client) {
    return;
  }

  client = await mongodb.connect(url, { useNewUrlParser: true });
  console.log('Successfully connected to MongoDB server');

  db = client.db(dbName);

  // avoid creation of duplicate runs
  db.collection('runs').createIndex({ runId: 1 }, { unique: true });
};

export const getMongoDB = () => db;
