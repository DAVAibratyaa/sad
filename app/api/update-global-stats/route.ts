import { NextResponse } from 'next/server'
import { updateActivityData, initDatabase } from '@/lib/db'

export async function POST() {
  try {
    await initDatabase()
    const today = new Date().toISOString().split('T')[0]
    await updateActivityData(today)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating global stats:', error)
    return NextResponse.json(
      { error: 'Failed to update global stats' }, 
      { status: 500 }
    )
  }
}

