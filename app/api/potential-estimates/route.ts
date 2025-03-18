import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import PotentialEstimate from '@/models/PotentialEstimate';

// GET handler to retrieve all potential estimates for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database with improved connection handling
    await connectToDatabase();
    const userId = session.user.id;

    console.log(`Fetching potential estimates for user: ${userId}`);

    // Find all estimates for the current user
    const estimates = await PotentialEstimate.find({ user: userId }).sort({ createdAt: -1 });

    console.log(`Found ${estimates.length} estimates for user: ${userId}`);

    return NextResponse.json({ estimates });
  } catch (error) {
    console.error('Error fetching potential estimates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch potential estimates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new potential estimate
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database with improved connection handling
    await connectToDatabase();
    const userId = session.user.id;
    const data = await req.json();

    // Log the received data
    console.log('Received data for new estimate:', JSON.stringify(data, null, 2));

    // Ensure countryCode is not empty
    if (!data.countryCode || data.countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      );
    }

    // Create a new estimate with proper type handling for all fields
    const newEstimate = new PotentialEstimate({
      user: userId,
      country: data.country,
      countryCode: data.countryCode,
      state: data.state || 'Not specified', // Ensure state is never empty
      financialYear: data.financialYear,
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      actualOSR: parseFloat(typeof data.actualOSR === 'string' ? data.actualOSR.replace(/,/g, '') : data.actualOSR || 0),
      budgetedOSR: parseFloat(typeof data.budgetedOSR === 'string' ? data.budgetedOSR.replace(/,/g, '') : data.budgetedOSR || 0),
      population: parseFloat(typeof data.population === 'string' ? data.population.replace(/,/g, '') : data.population || 0),
      gdpPerCapita: parseFloat(typeof data.gdpPerCapita === 'string' ? data.gdpPerCapita.replace(/,/g, '') : data.gdpPerCapita || 0),
    });

    await newEstimate.save();

    return NextResponse.json({ 
      message: 'Potential estimate created successfully',
      estimate: newEstimate 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating potential estimate:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if ('errors' in (error as any)) {
        console.error('Validation errors:', JSON.stringify((error as any).errors, null, 2));
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create potential estimate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 