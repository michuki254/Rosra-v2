import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { createReport, getReportsByUserId } from '@/app/services/unifiedReportService';
import { connectToDatabase } from '@/lib/mongoose';
import { randomUUID } from 'crypto';

function cleanNumericValue(value: string | number): number {
  if (typeof value === 'number') return value;
  // Remove commas and convert to number
  return parseFloat(value.replace(/,/g, ''));
}

// Ensure each category has an id field and correct field names
function ensureCategoryIds(categories: any[] = []): any[] {
  return categories.map(category => {
    // Create a new object without _id field to avoid conflicts
    const { _id, ...categoryWithoutId } = category;
    
    // Use existing id, or convert _id to string if it exists, or generate a new UUID
    const id = category.id || (_id ? _id.toString() : randomUUID());
    
    // Handle field name conversion
    const result: any = {
      ...categoryWithoutId,
      id
    };
    
    // Convert field names if needed
    if (category.actualLandValue !== undefined && category.averageLandValue === undefined) {
      result.averageLandValue = category.actualLandValue;
    }
    
    if (category.estimatedLandValue !== undefined && category.estimatedAverageValue === undefined) {
      result.estimatedAverageValue = category.estimatedLandValue;
    }
    
    // Ensure the reverse conversion as well
    if (category.averageLandValue !== undefined && category.actualLandValue === undefined) {
      result.actualLandValue = category.averageLandValue;
    }
    
    if (category.estimatedAverageValue !== undefined && category.estimatedLandValue === undefined) {
      result.estimatedLandValue = category.estimatedAverageValue;
    }
    
    return result;
  });
}

// GET handler - Retrieve all reports for the authenticated user
export async function GET(request: NextRequest) {
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
    
    // Ensure we have a connection to the database
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    // Get all reports for the user
    const reports = await getReportsByUserId(userId);
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching unified reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new report
export async function POST(request: NextRequest) {
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
    
    // Ensure we have a connection to the database
    const connection = await connectToDatabase();
    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }
    
    // Get request body
    const { estimate, propertyTax, license, shortTerm } = await request.json();
    
    // Clean numeric values in estimate
    const cleanedEstimate = {
      ...estimate,
      actualOSR: cleanNumericValue(estimate.actualOSR),
      budgetedOSR: cleanNumericValue(estimate.budgetedOSR),
      population: cleanNumericValue(estimate.population),
      gdpPerCapita: cleanNumericValue(estimate.gdpPerCapita)
    };
    
    // Create the unified report
    const report = await createReport({
      user: userId,
      title: `${cleanedEstimate.country} - ${cleanedEstimate.financialYear}`,
      country: cleanedEstimate.country,
      countryCode: cleanedEstimate.countryCode,
      state: cleanedEstimate.state || 'Not specified',
      financialYear: cleanedEstimate.financialYear,
      currency: cleanedEstimate.currency,
      currencySymbol: cleanedEstimate.currencySymbol,
      actualOSR: cleanedEstimate.actualOSR,
      budgetedOSR: cleanedEstimate.budgetedOSR,
      population: cleanedEstimate.population,
      gdpPerCapita: cleanedEstimate.gdpPerCapita,
      
      // Add property tax data if provided
      propertyTax: propertyTax ? {
        metrics: propertyTax.metrics || {},
        categories: ensureCategoryIds(propertyTax.categories || []),
        totalEstimatedTaxPayers: propertyTax.totalEstimatedTaxPayers || 0,
        registeredTaxPayers: propertyTax.registeredTaxPayers || 0
      } : undefined,
      
      // Add license data if provided
      license: license ? {
        metrics: license.metrics || {},
        categories: ensureCategoryIds(license.categories || []),
        totalEstimatedLicensees: license.totalEstimatedLicensees || 0,
        registeredLicensees: license.registeredLicensees || 0,
        licenseRegistrationRate: license.licenseRegistrationRate || 0,
        averageLicenseFee: license.averageLicenseFee || 0,
        complianceRate: license.complianceRate || 0,
        assessmentAccuracy: license.assessmentAccuracy || 0,
        notes: license.notes || ''
      } : undefined,
      
      // Add short term data if provided
      shortTerm: shortTerm ? {
        metrics: shortTerm.metrics || {},
        categories: ensureCategoryIds(shortTerm.categories || []),
        country: shortTerm.country || cleanedEstimate.country || 'Not specified',
        state: shortTerm.state || cleanedEstimate.state || 'Not specified'
      } : undefined
    });
    
    return NextResponse.json({
      success: true,
      id: report._id,
      message: 'Report saved successfully',
      report
    });
  } catch (error) {
    console.error('Error creating unified report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
} 