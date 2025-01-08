import { NextResponse } from 'next/server'
import { getPopularExams, initDatabase } from '@/lib/db'

export async function GET() {
  try {
    await initDatabase()
    const popularExams = await getPopularExams(10)
    
    return NextResponse.json(popularExams)
  } catch (error) {
    console.error('Error fetching popular exams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular exams' }, 
      { status: 500 }
    )
  }
}

