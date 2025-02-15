import { NextResponse } from 'next/server'
import countriesData from '@/data/countries.json'

export async function GET() {
  try {
    return NextResponse.json(countriesData)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    )
  }
}