import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import LicenseAnalysis from '@/models/LicenseAnalysis';

// GET handler to retrieve all license analyses for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();
    const userId = session.user.id;

    console.log(`Fetching license analyses for user: ${userId}`);

    // Find all license analyses for the current user
    const analyses = await LicenseAnalysis.find({ userId }).sort({ createdAt: -1 });

    console.log(`Found ${analyses.length} license analyses for user: ${userId}`);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching license analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license analyses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new license analysis
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();
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

    // Ensure categories have the correct structure
    const formattedCategories = data.categories.map((category: any) => ({
      name: category.name || 'Unnamed Category',
      registeredLicensees: category.registeredLicensees || 0,
      compliantLicensees: category.compliantLicensees || 0,
      estimatedLicensees: category.estimatedLicensees || 0,
      licenseFee: category.licenseFee || 0,
      averagePaidLicenseFee: category.averagePaidLicenseFee || 0
    }));

    // Create new license analysis
    const licenseAnalysis = new LicenseAnalysis({
      userId,
      country: data.country || 'Not specified',
      state: data.state || 'Not specified',
      reportId: data.reportId || null, // Optional report ID
      totalEstimatedLicensees: data.totalEstimatedLicensees || 0,
      categories: formattedCategories,
      metrics: data.metrics || {}
    });

    // Save to database
    await licenseAnalysis.save();

    return NextResponse.json(licenseAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create license analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 