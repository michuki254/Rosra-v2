import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { getReportById, updatePropertyTaxData } from '@/app/services/unifiedReportService';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler - Retrieve property tax data for a report
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
    
    // If no property tax data exists, return 404
    if (!report.propertyTax) {
      return NextResponse.json(
        { error: 'Property tax data not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report.propertyTax);
  } catch (error) {
    console.error('Error fetching property tax data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property tax data' },
      { status: 500 }
    );
  }
}

// PUT handler - Update property tax data for a report
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
    const propertyTaxData = await request.json();
    
    // Update the property tax data
    const updatedReport = await updatePropertyTaxData(reportId, userId, propertyTaxData);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Property tax data updated successfully',
      propertyTax: updatedReport.propertyTax
    });
  } catch (error) {
    console.error('Error updating property tax data:', error);
    return NextResponse.json(
      { error: 'Failed to update property tax data' },
      { status: 500 }
    );
  }
} 