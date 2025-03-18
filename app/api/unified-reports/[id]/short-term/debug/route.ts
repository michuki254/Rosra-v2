import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { connectToDatabase } from '@/lib/mongoose';
import UnifiedReport from '@/models/UnifiedReport';
import mongoose from 'mongoose';

// GET handler - Retrieve short term data directly from MongoDB for debugging
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
    
    console.log(`[DEBUG] Fetching short-term data directly from MongoDB for report ${reportId} and user ${userId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Direct MongoDB query to get the report with short-term data
    const report = await UnifiedReport.findOne(
      { _id: new mongoose.Types.ObjectId(reportId), user: userId },
      { shortTerm: 1, _id: 1, title: 1 }
    ).lean();
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Return detailed debug information
    return NextResponse.json({
      reportId: report._id,
      title: report.title,
      hasShortTermData: !!report.shortTerm,
      shortTermDataType: report.shortTerm ? typeof report.shortTerm : 'undefined',
      shortTermIsObject: report.shortTerm ? typeof report.shortTerm === 'object' : false,
      shortTermHasCategories: report.shortTerm && report.shortTerm.categories ? true : false,
      shortTermCategoriesCount: report.shortTerm && report.shortTerm.categories ? report.shortTerm.categories.length : 0,
      shortTermHasMetrics: report.shortTerm && report.shortTerm.metrics ? true : false,
      shortTermData: report.shortTerm || null,
      rawMongoDocument: report
    });
  } catch (error) {
    console.error('[DEBUG] Error fetching short term data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short term data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
