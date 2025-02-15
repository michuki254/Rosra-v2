import { NextResponse } from 'next/server'
import economicData from '@/data/economic-data.json'

export async function GET() {
  return NextResponse.json(economicData)
} 