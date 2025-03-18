import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/config';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import ShortTermAnalysis from '@/models/ShortTermAnalysis';

// Ensure each category has an id field
function ensureCategoryIds(categories: any[] = []): any[] {
  return categories.map(category => {
    // Create a new object without _id field to avoid conflicts
    const { _id, ...categoryWithoutId } = category;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    return {
      ...categoryWithoutId,
      id
    };
  });
}

// GET handler - Retrieve all short term analyses or the most recent one
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Get all short term analyses for the user
    const analyses = await ShortTermAnalysis.find({ userId })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(10); // Limit to 10 most recent analyses
    
    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching short term analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short term analyses' },
      { status: 500 }
    );
  }
}

// POST handler - Create new standalone short term analysis
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get request body
    const data = await request.json();
    
    // Validate categories
    if (!Array.isArray(data.categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      );
    }
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Create short term analysis
    const shortTermAnalysis = new ShortTermAnalysis({
      userId,
      country: data.country || 'Not specified',
      state: data.state || 'Not specified',
      categories: ensureCategoryIds(data.categories),
      metrics: data.metrics || {}
    });
    
    await shortTermAnalysis.save();
    
    return NextResponse.json(shortTermAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating short term analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create short term analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 