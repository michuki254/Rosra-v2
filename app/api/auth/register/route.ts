import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, organization } = await req.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate password length before attempting to save
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = new User({
      email,
      password, // Will be hashed by the pre-save hook
      firstName,
      lastName,
      organization,
      role: 'user', // Default role
      isActive: true,
    })

    try {
      // Save the user to the database
      await newUser.save()
    } catch (saveError: any) {
      // Handle validation errors from Mongoose
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: validationErrors.join(', ') },
          { status: 400 }
        )
      }
      throw saveError; // Re-throw if it's not a validation error
    }

    return NextResponse.json({
      message: 'User registered successfully',
      userId: newUser._id
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 