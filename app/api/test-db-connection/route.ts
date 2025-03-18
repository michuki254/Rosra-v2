import { NextRequest, NextResponse } from 'next/server';
import { testMongooseConnection } from '@/lib/mongoose';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Test the database connection
    const result = await testMongooseConnection();
    
    // Get list of collections in the database
    const collections = mongoose.connection.db ? 
      await mongoose.connection.db.listCollections().toArray() : 
      [];
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      collections: collections.map(col => col.name),
      databaseName: mongoose.connection.db?.databaseName || 'Not connected'
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An error occurred while testing the database connection',
        error: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 