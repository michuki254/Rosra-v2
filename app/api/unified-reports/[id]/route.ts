import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { 
  getReportById, 
  updateReport, 
  deleteReport,
  updatePropertyTaxData,
  updateLicenseData
} from '@/app/services/unifiedReportService';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler - Retrieve a specific report
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
    
    console.log(`Fetching report with ID: ${reportId} for user: ${userId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Get the report
    const report = await getReportById(reportId, userId);
    
    if (!report) {
      console.error(`Report not found with ID: ${reportId}`);
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    console.log(`Successfully retrieved report: ${reportId}`);
    
    // Return the report in the expected format
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a specific report
export async function PUT(
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
    
    // Get request body
    const data = await request.json();
    
    // Update the report
    const updatedReport = await updateReport(reportId, userId, data);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a specific report
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
    
    // Delete the report
    const success = await deleteReport(reportId, userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Report not found or could not be deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
} 