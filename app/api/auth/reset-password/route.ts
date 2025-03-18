import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import User from '@/app/models/User';
import PasswordResetToken from '@/app/models/PasswordResetToken';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email, and password are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Verify the token from the database
    const resetToken = await PasswordResetToken.findOne({
      email,
      token,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const updateResult = await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }

    // Delete the used token
    await PasswordResetToken.deleteOne({ email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 