import { NextResponse } from 'next/server'
import { getRecentReports, initDatabase } from '@/lib/db'

export async function GET() {
  try {
    await initDatabase()
    const recentReports = await getRecentReports(5)
    
    return NextResponse.json(recentReports)
  } catch (error) {
    console.error('Error fetching recent reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent reports' }, 
      { status: 500 }
    )
  }
}

