import { Report } from './types'

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type")
  
  try {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } else {
      const text = await response.text()
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return text
    }
  } catch (error) {
    console.error('Error handling response:', error)
    throw error
  }
}

export async function fetchActivityData(): Promise<{ date: string; count: number }[]> {
  try {
    const response = await fetch('/api/activity-data')
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch activity data: ${response.status} ${response.statusText}. ${errorText}`)
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Invalid activity data format')
    }
    return data
  } catch (error) {
    console.error("Error in fetchActivityData:", error)
    throw error
  }
}

export async function generateReport(examType: string, findings: string): Promise<Report> {
  try {
    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exame: examType, achados: findings }),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to generate report: ${response.status} ${response.statusText}. ${errorText}`)
    }
    return handleResponse(response)
  } catch (error) {
    console.error("Error in generateReport:", error)
    throw error
  }
}

export async function updateGlobalStats(): Promise<void> {
  try {
    const response = await fetch('/api/update-global-stats', {
      method: 'POST',
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to update global stats: ${response.status} ${response.statusText}. ${errorText}`)
    }
  } catch (error) {
    console.error("Error in updateGlobalStats:", error)
    throw error
  }
}

export async function fetchPopularExams(): Promise<{ name: string; count: number }[]> {
  try {
    const response = await fetch('/api/popular-exams')
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch popular exams: ${response.status} ${response.statusText}. ${errorText}`)
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Invalid popular exams data format')
    }
    return data
  } catch (error) {
    console.error("Error in fetchPopularExams:", error)
    throw error
  }
}

export async function fetchPopularFindings(): Promise<{ name: string; count: number }[]> {
  try {
    const response = await fetch('/api/popular-findings')
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch popular findings: ${response.status} ${response.statusText}. ${errorText}`)
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Invalid popular findings data format')
    }
    return data
  } catch (error) {
    console.error("Error in fetchPopularFindings:", error)
    throw error
  }
}

export async function fetchRecentReports(): Promise<{ id: number; examType: string; createdAt: string }[]> {
  try {
    const response = await fetch('/api/recent-reports')
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch recent reports: ${response.status} ${response.statusText}. ${errorText}`)
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Invalid recent reports data format')
    }
    return data
  } catch (error) {
    console.error("Error in fetchRecentReports:", error)
    throw error
  }
}

export async function saveReport(report: Report): Promise<Report> {
  try {
    const response = await fetch('/api/save-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    })

    const result = await handleResponse(response)
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to save report')
    }

    return result.data
  } catch (error) {
    console.error("Error in saveReport:", error)
    throw new Error(`Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

