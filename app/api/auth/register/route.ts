import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'
import bcrypt from 'bcryptjs'

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

    const pool = await getConnection()

    // Check if user already exists
    const existingUser = await pool.request()
      .input('email', email)
      .query('SELECT Email FROM Users WHERE Email = @email')

    if (existingUser.recordset.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert new user
    const result = await pool.request()
      .input('email', email)
      .input('passwordHash', hashedPassword)
      .input('firstName', firstName)
      .input('lastName', lastName)
      .input('organization', organization)
      .query(`
        INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Organization)
        VALUES (@email, @passwordHash, @firstName, @lastName, @organization);
        SELECT SCOPE_IDENTITY() AS UserId;
      `)

    return NextResponse.json({
      message: 'User registered successfully',
      userId: result.recordset[0].UserId
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 