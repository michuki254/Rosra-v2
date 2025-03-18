import { NextResponse } from 'next/server';
import { testMongooseConnection } from '@/lib/mongoose';

export async function GET() {
  try {
    const result = await testMongooseConnection();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      },
      { status: 500 }
    );
  }
} 