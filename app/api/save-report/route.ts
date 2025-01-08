import { NextResponse } from 'next/server'
import { saveReport } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const report = await req.json()
    
    console.log('Received report data:', {
      examType: report.examType,
      findings: report.findings,
      generatedReport: report.generatedReport,
      followUpRecommendations: report.followUpRecommendations,
      differentialDiagnosis: report.differentialDiagnosis
    });

    // Update the validation check to be less strict
    if (!report.examType || !report.findings || !report.generatedReport) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const savedReport = await saveReport(report)
    
    if (!savedReport) {
      throw new Error('Failed to save report to database')
    }

    return NextResponse.json({
      success: true,
      data: savedReport
    })
  } catch (error) {
    console.error('Error in save-report route:', error)
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

