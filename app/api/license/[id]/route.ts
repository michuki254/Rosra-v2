import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import LicenseAnalysis from '@/models/LicenseAnalysis';
import mongoose from 'mongoose';

// GET handler to retrieve a specific license analysis
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

    // Connect to the database
    await connectToDatabase();
    const userId = session.user.id;
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Find the license analysis
    const analysis = await LicenseAnalysis.findOne({
      _id: id,
      userId
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific license analysis
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

    // Connect to the database
    await connectToDatabase();
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

    // Format the data for update
    const updateData = { ...data };

    // Ensure categories have the correct structure if they exist
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

    // Update the license analysis
    const analysis = await LicenseAnalysis.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!analysis) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error updating license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update license analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a specific license analysis
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

    // Connect to the database
    await connectToDatabase();
    const userId = session.user.id;
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Delete the license analysis
    const result = await LicenseAnalysis.deleteOne({
      _id: id,
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'License analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting license analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete license analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 