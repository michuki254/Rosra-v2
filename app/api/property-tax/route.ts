import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import PropertyTaxAnalysis from '@/models/PropertyTaxAnalysis';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

// Ensure each category has an id field and correct field names
function ensureCategoryIds(categories: any[] = []): any[] {
  return categories.map(category => {
    // Create a new object without _id field to avoid conflicts
    const { _id, ...categoryWithoutId } = category;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    // Handle field name conversion
    const result: any = {
      ...categoryWithoutId,
      id
    };
    
    // Convert field names if needed
    if (category.actualLandValue !== undefined && category.averageLandValue === undefined) {
      result.averageLandValue = category.actualLandValue;
    }
    
    if (category.estimatedLandValue !== undefined && category.estimatedAverageValue === undefined) {
      result.estimatedAverageValue = category.estimatedLandValue;
    }
    
    // Ensure the reverse conversion as well
    if (category.averageLandValue !== undefined && category.actualLandValue === undefined) {
      result.actualLandValue = category.averageLandValue;
    }
    
    if (category.estimatedAverageValue !== undefined && category.estimatedLandValue === undefined) {
      result.estimatedLandValue = category.estimatedAverageValue;
    }
    
    return result;
  });
}

// GET handler to retrieve all property tax analyses for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database and ensure the connection is fully established
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    const userId = session.user.id;

    console.log(`Fetching property tax analyses for user: ${userId}`);

    // Find all property tax analyses for the current user
    const analyses = await PropertyTaxAnalysis.find({ userId }).sort({ createdAt: -1 });

    console.log(`Found ${analyses.length} property tax analyses for user: ${userId}`);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching property tax analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property tax analyses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new property tax analysis
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database and ensure the connection is fully established
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    const userId = session.user.id;

    // Get request body
    const data = await req.json();

    // Validate categories
    if (!Array.isArray(data.categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      );
    }

    // Ensure each category has an id field
    const categories = ensureCategoryIds(data.categories);

    // Create new property tax analysis
    const propertyTaxAnalysis = new PropertyTaxAnalysis({
      userId,
      country: data.country || 'Not specified',
      state: data.state || 'Not specified',
      reportId: data.reportId || null, // Optional report ID
      totalEstimatedTaxPayers: data.totalEstimatedTaxPayers,
      registeredTaxPayers: data.registeredTaxPayers,
      categories: categories,
      metrics: data.metrics || {
        actual: 0,
        potential: 0,
        gap: 0,
        potentialLeveraged: 0,
        gapBreakdown: {
          registrationGap: 0,
          complianceGap: 0,
          assessmentGap: 0,
          rateGap: 0,
          combinedGaps: 0
        }
      }
    });

    // Save to database
    await propertyTaxAnalysis.save();

    return NextResponse.json(propertyTaxAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create property tax analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 