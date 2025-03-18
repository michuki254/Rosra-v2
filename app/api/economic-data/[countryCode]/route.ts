import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  const { countryCode } = params;

  try {
    // Mock data for demonstration purposes
    const economicData = {
      countryCode,
      gdp: Math.floor(Math.random() * 1000000000000),
      gdpGrowth: (Math.random() * 10 - 2).toFixed(2),
      inflation: (Math.random() * 10).toFixed(2),
      unemployment: (Math.random() * 15).toFixed(2),
      population: Math.floor(Math.random() * 100000000),
      year: new Date().getFullYear() - 1,
    };

    return NextResponse.json(economicData);
  } catch (error) {
    console.error('Error fetching economic data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch economic data' },
      { status: 500 }
    );
  }
}