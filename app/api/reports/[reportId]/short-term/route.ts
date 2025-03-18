import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/config';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import ShortTermAnalysis from '@/models/ShortTermAnalysis';
import Report from '@/models/Report';

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

// GET handler - Retrieve short term analysis for a report
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
    
    const userId = session.user.id;
    const { reportId } = params;
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Find the report to ensure it exists and belongs to the user
    const report = await Report.findOne({
      _id: reportId,
      userId
    });
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Find the short term analysis for this report
    const shortTermAnalysis = await ShortTermAnalysis.findOne({
      reportId
    });
    
    if (!shortTermAnalysis) {
      return NextResponse.json(
        { error: 'Short term analysis not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(shortTermAnalysis);
  } catch (error) {
    console.error('Error fetching short term analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short term analysis' },
      { status: 500 }
    );
  }
}

// POST handler - Create new short term analysis for a report
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
    
    const userId = session.user.id;
    const { reportId } = params;
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Find the report to ensure it exists and belongs to the user
    const report = await Report.findOne({
      _id: reportId,
      userId
    });
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check if short term analysis already exists for this report
    const existingAnalysis = await ShortTermAnalysis.findOne({
      reportId
    });
    
    if (existingAnalysis) {
      return NextResponse.json(
        { error: 'Short term analysis already exists for this report' },
        { status: 409 }
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
    
    // Create short term analysis
    const shortTermAnalysis = new ShortTermAnalysis({
      userId,
      reportId,
      country: data.country || report.country || 'Not specified',
      state: data.state || report.state || 'Not specified',
      categories: ensureCategoryIds(data.categories),
      metrics: data.metrics || {}
    });
    
    await shortTermAnalysis.save();
    
    return NextResponse.json(shortTermAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating short term analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create short term analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler - Update short term analysis for a report
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
    
    const userId = session.user.id;
    const { reportId } = params;
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Find the report to ensure it exists and belongs to the user
    const report = await Report.findOne({
      _id: reportId,
      userId
    });
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Get request body
    const data = await request.json();
    
    // Validate categories if provided
    if (data.categories && !Array.isArray(data.categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (data.country) updateData.country = data.country;
    if (data.state) updateData.state = data.state;
    if (data.metrics) updateData.metrics = data.metrics;
    if (data.categories) updateData.categories = ensureCategoryIds(data.categories);
    
    // Update short term analysis
    const updatedAnalysis = await ShortTermAnalysis.findOneAndUpdate(
      { reportId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAnalysis) {
      return NextResponse.json(
        { error: 'Short term analysis not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedAnalysis);
  } catch (error) {
    console.error('Error updating short term analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update short term analysis' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete short term analysis for a report
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
    
    const userId = session.user.id;
    const { reportId } = params;
    
    // Ensure we have a connection to the database
    await connectToDatabase();
    
    // Find the report to ensure it exists and belongs to the user
    const report = await Report.findOne({
      _id: reportId,
      userId
    });
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Delete short term analysis
    const result = await ShortTermAnalysis.deleteOne({ reportId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Short term analysis not found for this report' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Short term analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting short term analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete short term analysis' },
      { status: 500 }
    );
  }
} 