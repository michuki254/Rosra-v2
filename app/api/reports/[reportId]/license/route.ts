import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/config';
import { 
  createLicenseAnalysis, 
  getLicenseAnalysisByReportId,
  updateLicenseAnalysis,
  deleteLicenseAnalysis
} from '@/app/services/licenseAnalysisService';
import { getReportById } from '@/app/services/reportService';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';

// GET handler - Retrieve license analysis for a report
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
    
    // Get license analysis data
    const licenseAnalysis = await getLicenseAnalysisByReportId(reportId);
    
    if (!licenseAnalysis) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(licenseAnalysis);
  } catch (error) {
    console.error('Error fetching license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license analysis' },
      { status: 500 }
    );
  }
}

// POST handler - Create new license analysis
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
    await connectToDatabase();
    
    // Check if LicenseAnalysis collection exists
    let collectionExists = false;
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      collectionExists = collections.some(col => col.name === 'licenseanalyses');
      console.log(`LicenseAnalysis collection exists: ${collectionExists}`);
    } else {
      console.log('Database connection not established');
    }
    
    // Format categories to ensure they have the correct structure
    const formattedCategories = data.categories.map((category: any) => ({
      name: category.name || 'Unnamed Category',
      registeredLicensees: category.registeredLicensees || 0,
      compliantLicensees: category.compliantLicensees || 0,
      estimatedLicensees: category.estimatedLicensees || 0,
      licenseFee: category.licenseFee || 0,
      averagePaidLicenseFee: category.averagePaidLicenseFee || 0
    }));
    
    // Create license analysis
    const licenseAnalysis = await createLicenseAnalysis({
      userId,
      reportId,
      totalEstimatedLicensees: data.totalEstimatedLicensees || 0,
      categories: formattedCategories,
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
    
    return NextResponse.json(licenseAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create license analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler - Update license analysis
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
    
    // Format categories to ensure they have the correct structure if they exist
    let updateData: any = { ...data };
    
    if (data.categories) {
      updateData.categories = data.categories.map((category: any) => ({
        name: category.name || 'Unnamed Category',
        registeredLicensees: category.registeredLicensees || 0,
        compliantLicensees: category.compliantLicensees || 0,
        estimatedLicensees: category.estimatedLicensees || 0,
        licenseFee: category.licenseFee || 0,
        averagePaidLicenseFee: category.averagePaidLicenseFee || 0
      }));
    }
    
    // Update license analysis
    const licenseAnalysis = await updateLicenseAnalysis(reportId, {
      totalEstimatedLicensees: updateData.totalEstimatedLicensees,
      categories: updateData.categories,
      metrics: updateData.metrics
    });
    
    if (!licenseAnalysis) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(licenseAnalysis);
  } catch (error) {
    console.error('Error updating license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update license analysis' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete license analysis
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
    
    // Delete license analysis
    const success = await deleteLicenseAnalysis(reportId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete license analysis' },
      { status: 500 }
    );
  }
} 