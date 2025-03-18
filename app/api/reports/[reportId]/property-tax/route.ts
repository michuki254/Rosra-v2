import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/config';
import { 
  createPropertyTaxAnalysis, 
  getPropertyTaxAnalysisByReportId,
  updatePropertyTaxAnalysis,
  deletePropertyTaxAnalysis
} from '@/app/services/propertyTaxAnalysisService';
import { getReportById } from '@/app/services/reportService';
import { connectToDatabase } from '@/lib/mongoose';
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
      delete result.actualLandValue; // Remove the old field name
    }
    
    if (category.estimatedLandValue !== undefined && category.estimatedAverageValue === undefined) {
      result.estimatedAverageValue = category.estimatedLandValue;
      delete result.estimatedLandValue; // Remove the old field name
    }
    
    return result;
  });
}

// GET handler - Retrieve property tax analysis for a report
export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { reportId } = params;
    
    // Get property tax analysis data
    const propertyTaxAnalysis = await getPropertyTaxAnalysisByReportId(reportId);
    
    if (!propertyTaxAnalysis) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(propertyTaxAnalysis);
  } catch (error) {
    console.error('Error fetching property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property tax analysis' },
      { status: 500 }
    );
  }
}

// POST handler - Create new property tax analysis
export async function POST(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { reportId } = params;
    const userId = session.user.id;
    
    // Check if the report exists
    const report = await getReportById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found. Please create a report first.' },
        { status: 404 }
      );
    }
    
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
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    // Check if PropertyTaxAnalysis collection exists
    let collectionExists = false;
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      collectionExists = collections.some(col => col.name === 'propertytaxanalyses');
      console.log(`PropertyTaxAnalysis collection exists: ${collectionExists}`);
    } else {
      console.log('Database connection not established');
    }
    
    // Create property tax analysis
    const propertyTaxAnalysis = await createPropertyTaxAnalysis({
      userId,
      reportId,
      totalEstimatedTaxPayers: data.totalEstimatedTaxPayers,
      registeredTaxPayers: data.registeredTaxPayers,
      categories: ensureCategoryIds(data.categories)
    });
    
    return NextResponse.json(propertyTaxAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create property tax analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler - Update property tax analysis
export async function PUT(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { reportId } = params;
    
    // Check if the report exists
    const report = await getReportById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found. Please create a report first.' },
        { status: 404 }
      );
    }
    
    // Get request body
    const data = await request.json();
    
    // Ensure we have a connection to the database
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    // Update property tax analysis
    const propertyTaxAnalysis = await updatePropertyTaxAnalysis(reportId, {
      totalEstimatedTaxPayers: data.totalEstimatedTaxPayers,
      registeredTaxPayers: data.registeredTaxPayers,
      categories: ensureCategoryIds(data.categories)
    });
    
    if (!propertyTaxAnalysis) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(propertyTaxAnalysis);
  } catch (error) {
    console.error('Error updating property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update property tax analysis' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete property tax analysis
export async function DELETE(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { reportId } = params;
    
    // Ensure we have a connection to the database
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    // Delete property tax analysis
    const success = await deletePropertyTaxAnalysis(reportId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Property tax analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property tax analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete property tax analysis' },
      { status: 500 }
    );
  }
} 