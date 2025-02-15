import { NextResponse } from 'next/server'
import { testAzureConnection } from '@/lib/db'

export async function GET() {
  const result = await testAzureConnection()
  
  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(result, { status: 500 })
  }
} 