import { NextResponse } from 'next/server'
import { getActivityData, initDatabase } from '@/lib/db'

export async function GET() {
  try {
    await initDatabase()
    const activityData = await getActivityData()
    
    return NextResponse.json(activityData)
  } catch (error) {
    console.error('Error fetching activity data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity data' }, 
      { status: 500 }
    )
  }
}

