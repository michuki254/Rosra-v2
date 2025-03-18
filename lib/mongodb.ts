import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://skmichuki:zEGe19uArhJr9Fh8@cluster0.tpzox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new MongoDB client
  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to the MongoDB server
    await client.connect();
    const db = client.db('rosra-db'); // Use a specific database name

    // Cache the client and db connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Test the connection
export async function testMongoConnection() {
  try {
    const { client, db } = await connectToDatabase();
    const result = await db.command({ ping: 1 });
    console.log('MongoDB connection successful:', result);
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