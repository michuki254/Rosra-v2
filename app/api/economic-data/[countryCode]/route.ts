import { NextResponse } from 'next/server'
import economicData from '@/data/economic-data.json'

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  // Await the params to handle them asynchronously
  const countryCode = await params.countryCode

  const data = economicData.find(
    (item) => item['Country Code'] === countryCode
  )

  if (!data) {
    return NextResponse.json(
      { error: 'Economic data not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
} 