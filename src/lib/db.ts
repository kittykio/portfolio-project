import mongoose, { Connection } from 'mongoose';

type MongoConnectionCache = {
  connection: Connection | null;
  promise: Promise<Connection> | null;
};

const globalWithMongo = globalThis as typeof globalThis & {
  mongoConnectionCache?: MongoConnectionCache;
};

// Keep one pool per warm server process, including across module reloads and
// separate Next.js server bundles that share the same runtime.
const cache = globalWithMongo.mongoConnectionCache ?? {
  connection: null,
  promise: null,
};

globalWithMongo.mongoConnectionCache = cache;

const connectToMongoDB = async () => {
  if (cache.connection?.readyState === 1) {
    console.log('Using cached db connection');
    return cache.connection;
  }

  // Never reuse a stale connection (or its already-resolved promise) after
  // Atlas or the serverless runtime closes it.
  if (cache.connection) {
    cache.connection = null;
    cache.promise = null;
  }

  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required for persistent likes.');

    if (!cache.promise) {
      cache.promise = mongoose
        .connect(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DB_NAME || 'portfolio-project',
          // Vercel can run many function instances concurrently. A small pool per
          // instance prevents those instances from exhausting Atlas connection limits.
          maxPoolSize: 5,
          minPoolSize: 0,
          maxIdleTimeMS: 30_000,
          serverSelectionTimeoutMS: 10_000,
        })
        .then((mongooseInstance) => mongooseInstance.connection);
    }

    cache.connection = await cache.promise;
    console.log('New mongodb connection established');
    return cache.connection;
  } catch (error) {
    // A rejected promise must not poison future requests in a warm function.
    cache.promise = null;
    cache.connection = null;
    console.log(error);
    throw error;
  }
};

export default connectToMongoDB;
