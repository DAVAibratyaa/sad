import { NextResponse } from 'next/server'
import { saveReport, initDatabase, updateActivityData } from '@/lib/db'

export async function POST(req: Request) {
  try {
    await initDatabase()
    const { achados, exame } = await req.json()
    
    if (!achados || !exame) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://v0.dev',
        'X-Title': 'Radiology Report Generator'
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet-20241022:beta",
        messages: [
          {
            role: "system",
            content: process.env.RADIOLOGY_SYSTEM_PROMPT || ''
          },
          {
            role: "user",
            content: `${process.env.RADIOLOGY_SYSTEM_PROMPT}

Exame: ${exame}
Achados: ${achados}`
          }
        ],
        temperature: 0.0,
        max_tokens: 6000
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in response')
    }

    // Count findings (simple word count for demonstration)
    const findingsCount = achados.split(/\s+/).length

    // Update activity data for today with findings count
    const today = new Date().toISOString().split('T')[0]
    await updateActivityData(today, findingsCount)

    // Create the report object
    const reportData = {
      examType: exame,
      findings: achados,
      generatedReport: content,
      aiInsights: await generateAIInsights(content)
    }

    // Save report to database
    const savedReport = await saveReport(reportData)

    // Return the complete report data
    return NextResponse.json({ 
      success: true, 
      data: savedReport
    })

  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      },
      { status: 500 }
    )
  }
}

async function generateAIInsights(report: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://v0.dev',
      'X-Title': 'Radiology Report Generator'
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet-20241022:beta",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em radiologia. Analise o laudo fornecido e forneça insights importantes, áreas de preocupação e sugestões de literatura médica relevante."
        },
        {
          role: "user",
          content: `Com base no seguinte laudo radiológico, forneça insights chave, áreas potenciais de preocupação e sugira literatura médica relevante para leitura adicional:

${report}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })
  })

  if (!response.ok) {
    throw new Error(`AI Insights API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "No insights generated"
}

