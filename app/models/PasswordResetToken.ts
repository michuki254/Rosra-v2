import mongoose from 'mongoose';

// Define the schema
const passwordResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model if it doesn't exist, or use the existing one
const PasswordResetToken = mongoose.models.PasswordResetToken || 
  mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken; 