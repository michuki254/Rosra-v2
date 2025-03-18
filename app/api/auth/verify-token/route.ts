import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import PasswordResetToken from '@/app/models/PasswordResetToken';

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { valid: false, error: 'Token and email are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the token exists and is not expired
    const resetToken = await PasswordResetToken.findOne({
      email,
      token,
      expiresAt: { $gt: new Date() }
    });

    return NextResponse.json({ valid: !!resetToken });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to verify token' },
      { status: 500 }
    );
  }
} 