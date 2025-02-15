import { NextResponse } from 'next/server'
import { Country } from '@/app/types/country'
import countriesData from '@/data/countries.json'

export async function GET(
  request: Request,
  { params }: { params: { iso2: string } }
) {
  try {
    const iso2 = await params.iso2
    const country = (countriesData as Country[]).find(
      (country) => country.iso2.toLowerCase() === iso2.toLowerCase()
    )

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(country)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch country' },
      { status: 500 }
    )
  }
}