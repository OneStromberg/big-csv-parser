const { MongoClient } = require('mongodb');
const { DB_NAME } = require('./constants');

async function createDAU() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  return client.db(DB_NAME);
}

async function createIndexedCollection(dau, indexMap, collectionName) {
  const collection = dau.collection(collectionName);
  if (indexMap && Object.values(indexMap).length) {
    collection.createIndex(indexMap, { unique: true });
  }
  return collection;
}

async function getDAUCollection(collectionName, indexes) {
  const dau = await createDAU();
  const collection = createIndexedCollection(dau, indexes, collectionName);
  return collection;
}

module.exports = {
  createDAU,
  createIndexedCollection,
  getDAUCollection,
};
