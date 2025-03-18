import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { 
  getReportById, 
  updateLongTermData
} from '@/app/services/unifiedReportService';
import { connectToDatabase } from '@/lib/mongoose';
import { randomUUID } from 'crypto';

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

// GET handler - Retrieve long term data for a report
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    // Await params before accessing its properties
    const params = await context.params;
    const reportId = params.id;
    
    console.log(`Fetching long-term data for report ${reportId} and user ${userId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Get the report
    const report = await getReportById(reportId, userId);
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // If no long term data exists, return 404
    if (!report.longTerm) {
      return NextResponse.json(
        { error: 'Long term data not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report.longTerm);
  } catch (error) {
    console.error('Error fetching long term data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch long term data' },
      { status: 500 }
    );
  }
}

// POST/PUT handler - Create or update long term data for a report
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    // Await params before accessing its properties
    const params = await context.params;
    const reportId = params.id;
    
    console.log(`Processing long-term data save for report ${reportId} and user ${userId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Get request body
    const longTermData = await request.json();
    
    // Format categories if they exist
    if (longTermData.categories && Array.isArray(longTermData.categories)) {
      longTermData.categories = ensureCategoryIds(longTermData.categories);
      
      // Ensure each category has the required fields
      longTermData.categories = longTermData.categories.map((category: any) => {
        return {
          id: category.id,
          name: category.name || 'Unnamed Category',
          estimatedLeases: Number(category.estimatedLeases) || 0,
          registeredLeases: Number(category.registeredLeases) || 0,
          potentialRate: Number(category.potentialRate) || 0,
          actualRate: Number(category.actualRate) || 0,
          isExpanded: Boolean(category.isExpanded) || false
        };
      });
    }
    
    // Update the long term data
    const updatedReport = await updateLongTermData(reportId, userId, longTermData);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Long term data updated successfully',
      longTerm: updatedReport.longTerm
    });
  } catch (error) {
    console.error('Error updating long term data:', error);
    return NextResponse.json(
      { error: 'Failed to update long term data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler - Same as POST for consistency with other endpoints
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return POST(request, context);
}

// DELETE handler - Remove long term data from a report
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    // Await params before accessing its properties
    const params = await context.params;
    const reportId = params.id;
    
    // Connect to database
    await connectToDatabase();
    
    // Get the report to ensure it exists
    const report = await getReportById(reportId, userId);
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Update the report to remove long term data
    const updatedReport = await updateLongTermData(reportId, userId, null);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Failed to delete long term data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Long term data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting long term data:', error);
    return NextResponse.json(
      { error: 'Failed to delete long term data' },
      { status: 500 }
    );
  }
} 