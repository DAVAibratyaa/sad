import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { userId } = await request.json()

  // In a real app, you'd update the activity data in your database here
  console.log(`Updating activity for user ${userId}`)

  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json({ success: true })
}

