// This script creates an admin user in the database
// Run with: node scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://skmichuki:zEGe19uArhJr9Fh8@cluster0.tpzox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = 'rosra-db';

// Admin user details
const adminUser = {
  email: 'admin@example.com',
  password: 'admin123456',
  firstName: 'Admin',
  lastName: 'User',
  organization: 'ROSRA',
  role: 'admin',
  isActive: true,
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create User schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const User = mongoose.model('User', UserSchema);

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create new admin user
    const newUser = new User({
      ...adminUser,
      password: hashedPassword,
    });
    
    // Save to database
    await newUser.save();
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await createAdminUser();
  process.exit(0);
}

run(); 