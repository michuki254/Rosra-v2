import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { UnifiedReportService } from '@/app/services/unifiedReportService';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';

// GET handler for retrieving mixed charge data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the report ID from the URL params
    const reportId = params.id;
    
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }
    
    // Get the report from the database
    const report = await UnifiedReportService.getReportById(reportId, session.user.id);
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    // Return the mixed charge data
    return NextResponse.json({ mixedCharge: report.mixedCharge || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve mixed charge data' }, { status: 500 });
  }
}

// POST handler for updating mixed charge data
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the report ID from the URL params
    const reportId = params.id;
    
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }
    
    // Parse the request body
    const mixedChargeData = await request.json();
    
    if (!mixedChargeData) {
      return NextResponse.json({ error: 'Mixed charge data is required' }, { status: 400 });
    }
    
    // Process the data to ensure all values are properly formatted
    const processedData = {
      metrics: mixedChargeData.metrics,
      data: MixedChargeAnalysisService.processInputData(mixedChargeData.data)
    };
    
    // Update the report with the mixed charge data
    const updatedReport = await UnifiedReportService.updateMixedChargeData(
      reportId,
      session.user.id,
      processedData
    );
    
    if (!updatedReport) {
      return NextResponse.json({ error: 'Failed to update mixed charge data' }, { status: 500 });
    }
    
    // Return the updated report
    return NextResponse.json({ mixedCharge: updatedReport.mixedCharge || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update mixed charge data' }, { status: 500 });
  }
}
