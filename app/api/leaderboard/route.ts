import { NextResponse } from 'next/server'
import { LeaderboardEntry } from '@/lib/types'

const mockLeaderboard: LeaderboardEntry[] = [
  { name: 'Dr. Maria Santos', points: 1500, reportsGenerated: 30 },
  { name: 'Dr. João Silva', points: 1250, reportsGenerated: 25 },
  { name: 'Dr. Ana Oliveira', points: 1100, reportsGenerated: 22 },
  { name: 'Dr. Carlos Ferreira', points: 950, reportsGenerated: 19 },
  { name: 'Dr. Beatriz Costa', points: 800, reportsGenerated: 16 },
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockLeaderboard)
}

