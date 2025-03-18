import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { getReportById, updateLicenseData } from '@/app/services/unifiedReportService';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler - Retrieve license data for a report
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
    
    // If no license data exists, return 404
    if (!report.license) {
      return NextResponse.json(
        { error: 'License data not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report.license);
  } catch (error) {
    console.error('Error fetching license data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license data' },
      { status: 500 }
    );
  }
}

// PUT handler - Update license data for a report
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
    const licenseData = await request.json();
    
    // Format license categories if they exist
    if (licenseData.categories && Array.isArray(licenseData.categories)) {
      licenseData.categories = licenseData.categories.map((category: any) => {
        // Remove unwanted fields
        const { score, questions, ...cleanCategory } = category;
        
        // Ensure all required fields are present
        return {
          name: category.name || 'Unnamed Category',
          registeredLicensees: category.registeredLicensees || 0,
          compliantLicensees: category.compliantLicensees || 0,
          estimatedLicensees: category.estimatedLicensees || 0,
          licenseFee: category.licenseFee || 0,
          averagePaidLicenseFee: category.averagePaidLicenseFee || 0,
          ...cleanCategory
        };
      });
    }
    
    // Update the license data
    const updatedReport = await updateLicenseData(reportId, userId, licenseData);
    
    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'License data updated successfully',
      license: updatedReport.license
    });
  } catch (error) {
    console.error('Error updating license data:', error);
    return NextResponse.json(
      { error: 'Failed to update license data' },
      { status: 500 }
    );
  }
} 