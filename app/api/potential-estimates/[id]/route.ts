import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import PotentialEstimate from '@/models/PotentialEstimate';

// GET handler to retrieve a specific potential estimate
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id: estimateId } = await context.params;
    
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
    
    console.log(`Fetching estimate ${estimateId} for user: ${userId}`);
    
    // Find the specific estimate for the current user
    const estimate = await PotentialEstimate.findOne({ 
      _id: estimateId,
      user: userId 
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Potential estimate not found' },
        { status: 404 }
      );
    }

    console.log(`Found estimate ${estimateId} for user: ${userId}`);

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error('Error fetching potential estimate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch potential estimate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific potential estimate
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id: estimateId } = await context.params;
    
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
    const data = await request.json();

    console.log(`Updating estimate ${estimateId} for user: ${userId} with data:`, JSON.stringify(data, null, 2));

    // Find and update the estimate
    const updatedEstimate = await PotentialEstimate.findOneAndUpdate(
      { _id: estimateId, user: userId },
      {
        country: data.country,
        countryCode: data.countryCode,
        state: data.state || 'Not specified', // Ensure state is never empty
        financialYear: data.financialYear,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
        actualOSR: parseFloat(data.actualOSR.replace(/,/g, '')),
        budgetedOSR: parseFloat(data.budgetedOSR.replace(/,/g, '')),
        population: parseFloat(data.population.replace(/,/g, '')),
        gdpPerCapita: parseFloat(data.gdpPerCapita.replace(/,/g, '')),
      },
      { new: true }
    );

    if (!updatedEstimate) {
      return NextResponse.json(
        { error: 'Potential estimate not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully updated estimate ${estimateId} for user: ${userId}`);

    return NextResponse.json({ 
      message: 'Potential estimate updated successfully',
      estimate: updatedEstimate 
    });
  } catch (error) {
    console.error('Error updating potential estimate:', error);
    return NextResponse.json(
      { error: 'Failed to update potential estimate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a specific potential estimate
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id: estimateId } = await context.params;
    
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

    console.log(`Deleting estimate ${estimateId} for user: ${userId}`);

    // Find and delete the estimate
    const deletedEstimate = await PotentialEstimate.findOneAndDelete({
      _id: estimateId,
      user: userId
    });

    if (!deletedEstimate) {
      return NextResponse.json(
        { error: 'Potential estimate not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully deleted estimate ${estimateId} for user: ${userId}`);

    return NextResponse.json({ 
      message: 'Potential estimate deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting potential estimate:', error);
    return NextResponse.json(
      { error: 'Failed to delete potential estimate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 