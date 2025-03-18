// This script tests the MongoDB connection
// Run with: node scripts/test-mongodb.js

const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://skmichuki:zEGe19uArhJr9Fh8@cluster0.tpzox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = 'rosra-db';

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Test the connection with a simple command
    const result = await mongoose.connection.db.command({ ping: 1 });
    console.log('MongoDB ping result:', result);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Count documents in the User collection if it exists
    if (collections.some(c => c.name === 'users')) {
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`Number of users in the database: ${userCount}`);
    } else {
      console.log('No users collection found. You may need to create some users first.');
    }
    
    console.log('MongoDB connection test completed successfully!');
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testConnection(); 