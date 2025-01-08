import { NextResponse } from 'next/server'
import { getPopularFindings, initDatabase } from '@/lib/db'

export async function GET() {
  try {
    await initDatabase()
    const popularFindings = await getPopularFindings(10)
    
    return NextResponse.json(popularFindings)
  } catch (error) {
    console.error('Error fetching popular findings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular findings' }, 
      { status: 500 }
    )
  }
}

