import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { 
  getReportById, 
  updateShortTermData
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

// GET handler - Retrieve short term data for a report
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
    
    console.log(`Fetching short-term data for report ${reportId} and user ${userId}`);
    
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
    
    // If no short term data exists, return 404
    if (!report.shortTerm) {
      return NextResponse.json(
        { error: 'Short term data not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report.shortTerm);
  } catch (error) {
    console.error('Error fetching short term data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short term data' },
      { status: 500 }
    );
  }
}

// POST/PUT handler - Create or update short term data for a report
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      console.error('Unauthorized: No session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const params = await context.params;
    const reportId = params.id;
    
    console.log(`Processing short-term data for report ${reportId} and user ${userId}`);
    
    // Get the data from the request body
    const data = await request.json();
    
    console.log('Received data in API route:', JSON.stringify(data, null, 2));
    
    if (!data || !data.metrics || !data.categories) {
      console.error('Invalid data format received:', data);
      return NextResponse.json(
        { error: 'Invalid data format. Both metrics and categories are required.' },
        { status: 400 }
      );
    }
    
    // Ensure categories have IDs
    if (data.categories) {
      data.categories = ensureCategoryIds(data.categories);
    }

    // Format metrics to match property tax structure
    const formattedData = {
      categories: data.categories || [],
      metrics: {
        totalEstimatedRevenue: Number(data.metrics?.potential || data.metrics?.totalEstimatedRevenue) || 0,
        totalActualRevenue: Number(data.metrics?.actual || data.metrics?.totalActualRevenue) || 0,
        totalGap: Number(data.metrics?.gap || data.metrics?.totalGap) || 0,
        currencySymbol: data.metrics?.currencySymbol || '$',
        potentialLeveraged: Number(data.metrics?.potentialLeveraged) || 0,
        gapBreakdown: {
          registrationGap: Number(data.metrics?.gapBreakdown?.registrationGap) || 0,
          registrationGapPercentage: Number(data.metrics?.gapBreakdown?.registrationGapPercentage) || 0,
          complianceGap: Number(data.metrics?.gapBreakdown?.complianceGap) || 0,
          complianceGapPercentage: Number(data.metrics?.gapBreakdown?.complianceGapPercentage) || 0,
          rateGap: Number(data.metrics?.gapBreakdown?.rateGap) || 0,
          rateGapPercentage: Number(data.metrics?.gapBreakdown?.rateGapPercentage) || 0,
          combinedGaps: Number(data.metrics?.gapBreakdown?.combinedGaps) || 0,
          combinedGapsPercentage: Number(data.metrics?.gapBreakdown?.combinedGapsPercentage) || 0
        },
        totalEstimatedDailyFees: Number(data.metrics?.totalEstimatedDailyFees) || 0,
        totalActualDailyFees: Number(data.metrics?.totalActualDailyFees) || 0
      },
      country: data.country || 'Not specified',
      state: data.state || 'Not specified',
      totalEstimatedDailyFees: Number(data.totalEstimatedDailyFees || data.metrics?.totalEstimatedDailyFees) || 0,
      totalActualDailyFees: Number(data.totalActualDailyFees || data.metrics?.totalActualDailyFees) || 0
    };
    
    console.log('Formatted data before saving:', JSON.stringify(formattedData, null, 2));
    
    // Connect to database
    await connectToDatabase();
    
    // Update the report with the new short term data
    const updatedReport = await updateShortTermData(reportId, userId, formattedData);
    
    if (!updatedReport) {
      console.error('Failed to update report:', { reportId, userId });
      return NextResponse.json(
        { error: 'Failed to update short term data' },
        { status: 500 }
      );
    }
    
    console.log('Successfully updated report:', updatedReport._id);
    console.log('Updated shortTerm data:', updatedReport.shortTerm ? 'exists' : 'missing');
    
    if (updatedReport.shortTerm) {
      return NextResponse.json(updatedReport.shortTerm);
    } else {
      console.error('shortTerm property missing from updated report');
      return NextResponse.json(
        { error: 'Short term data was not saved correctly' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating short term data:', error);
    return NextResponse.json(
      { error: 'Failed to update short term data' },
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

// DELETE handler - Remove short term data from a report
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
    
    // Update the report to remove short term data
    const updatedReport = await updateShortTermData(reportId, userId, null);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Failed to delete short term data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Short term data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting short term data:', error);
    return NextResponse.json(
      { error: 'Failed to delete short term data' },
      { status: 500 }
    );
  }
} 