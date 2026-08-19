// Importing mongoose library along with Connection type from it
import mongoose, { Connection } from 'mongoose';

// Declaring a variable to store the cached database connection
let cachedConnection: Connection | null = null;

// Function to establish a connection to MongoDB
const connectToMongoDB = async () => {
  // If a cached connection exists, return it
  if (cachedConnection) {
    console.log('Using cached db connection');
    return cachedConnection;
  }
  try {
    // If no cached connection exists, establish a new connection to MongoDB
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required for persistent likes.');
    const cnx = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'portfolio-project',
    });
    // Cache the connection for future use
    cachedConnection = cnx.connection;
    // Log message indicating a new MongoDB connection is established
    console.log('New mongodb connection established');
    // Return the newly established connection
    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
};

export default connectToMongoDB;
