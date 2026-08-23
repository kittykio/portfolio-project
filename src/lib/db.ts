import mongoose, { Connection } from 'mongoose';

// Reuse the connection within a warm server process to avoid exhausting the MongoDB pool.
let cachedConnection: Connection | null = null;

const connectToMongoDB = async () => {
  if (cachedConnection) {
    console.log('Using cached db connection');
    return cachedConnection;
  }
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required for persistent likes.');
    const cnx = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'portfolio-project',
    });
    cachedConnection = cnx.connection;
    console.log('New mongodb connection established');
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default connectToMongoDB;
