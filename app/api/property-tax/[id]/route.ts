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

// GET handler to retrieve a specific property tax analysis
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Find the property tax analysis
    const analysis = await PropertyTaxAnalysis.findOne({
      _id: id,
      userId
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property tax analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific property tax analysis
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Get request body
    const data = await req.json();

    // Validate categories
    if (data.categories && !Array.isArray(data.categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      );
    }

    // Ensure categories have IDs if they exist
    if (data.categories) {
      data.categories = ensureCategoryIds(data.categories);
    }

    // Update the property tax analysis
    const analysis = await PropertyTaxAnalysis.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!analysis) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error updating property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update property tax analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a specific property tax analysis
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Delete the property tax analysis
    const result = await PropertyTaxAnalysis.deleteOne({
      _id: id,
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete property tax analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 