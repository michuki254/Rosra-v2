import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://skmichuki:zEGe19uArhJr9Fh8@cluster0.tpzox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = 'rosra-db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// @ts-ignore - Global mongoose cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
  // @ts-ignore - Global mongoose cache
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  // Set up connection error handlers
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
    cached.conn = null;
    cached.promise = null;
  });

  return cached.conn;
}

export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Disconnected from MongoDB');
  }
}

// Test the connection
export async function testMongooseConnection() {
  try {
    await connectToDatabase();
    console.log('MongoDB connection successful');
    return {
      success: true,
      message: 'Successfully connected to MongoDB'
    };
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed'
    };
  }
} 