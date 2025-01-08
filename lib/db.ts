import { Pool } from 'pg'
import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz'

let pool: Pool | null = null

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined')
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for some database providers
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    })

    // Error handling for the pool
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  }
  return pool
}

export async function initDatabase() {
  try {
    const pool = getPool()
    
    // Test the connection
    await pool.query('SELECT NOW()')

    // Create reports table with new fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        exam_type TEXT NOT NULL,
        findings TEXT NOT NULL,
        generated_report TEXT NOT NULL,
        ai_insights TEXT NOT NULL,
        impressions TEXT,
        differential_diagnosis TEXT,
        follow_up_recommendations TEXT,
        thinking TEXT,
        logica TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create activity_data table with unique constraint on date
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_data (
        date DATE PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0
      )
    `)

    console.log('Database initialized successfully')
    return pool
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export async function saveReport(report: {
  examType: string,
  findings: string,
  generatedReport: string,
  aiInsights: string,
  impressions?: string,
  differentialDiagnosis?: string,
  followUpRecommendations?: string,
  thinking?: string,
  logica?: string
}) {
  try {
    const pool = getPool()
    
    // Convert current time to Brasília timezone
    const brasiliaDate = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    
    const result = await pool.query(`
      INSERT INTO reports (
        exam_type,
        findings,
        generated_report,
        ai_insights,
        impressions,
        differential_diagnosis,
        follow_up_recommendations,
        thinking,
        logica,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
        id, 
        exam_type as "examType", 
        findings,
        generated_report as "generatedReport",
        ai_insights as "aiInsights",
        impressions,
        differential_diagnosis as "differentialDiagnosis",
        follow_up_recommendations as "followUpRecommendations",
        thinking,
        logica,
        created_at as "createdAt"
    `, [
      report.examType,
      report.findings,
      report.generatedReport,
      report.aiInsights || null,
      report.impressions || null,
      report.differentialDiagnosis || null,
      report.followUpRecommendations || null,
      report.thinking || null,
      report.logica || null,
      brasiliaDate
    ])
    
    // Update activity data using Brasília date
    const today = format(brasiliaDate, 'yyyy-MM-dd')
    await updateActivityData(today)
    
    return result.rows[0]
  } catch (error) {
    console.error('Error in saveReport:', error)
    throw error
  }
}

export async function getActivityData() {
  try {
    const pool = getPool()
    const result = await pool.query(`
      SELECT 
        date::text, 
        count
      FROM activity_data 
      WHERE date >= NOW() - INTERVAL '30 days'
      ORDER BY date ASC
    `)
    return result.rows
  } catch (error) {
    console.error('Error in getActivityData:', error)
    throw error
  }
}

export async function updateActivityData(date: string) {
  try {
    const pool = getPool()
    await pool.query(`
      INSERT INTO activity_data (date, count)
      VALUES ($1, 1)
      ON CONFLICT (date)
      DO UPDATE SET 
        count = activity_data.count + 1
    `, [date])
  } catch (error) {
    console.error('Error in updateActivityData:', error)
    throw error
  }
}

export async function getRecentReports(limit: number = 5) {
  try {
    const pool = getPool()
    const result = await pool.query(`
      SELECT id, exam_type as "examType", created_at as "createdAt"
      FROM reports
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit])
    return result.rows
  } catch (error) {
    console.error('Error in getRecentReports:', error)
    throw error
  }
}

export async function getPopularExams(limit: number = 10) {
  try {
    const pool = getPool()
    const result = await pool.query(`
      SELECT exam_type as name, COUNT(*) as count
      FROM reports
      GROUP BY exam_type
      ORDER BY count DESC
      LIMIT $1
    `, [limit])
    return result.rows
  } catch (error) {
    console.error('Error in getPopularExams:', error)
    throw error
  }
}

export async function getPopularFindings(limit: number = 10) {
  try {
    const pool = getPool()
    const result = await pool.query(`
      SELECT unnest(string_to_array(findings, ', ')) as name, COUNT(*) as count
      FROM reports
      GROUP BY name
      ORDER BY count DESC
      LIMIT $1
    `, [limit])
    return result.rows
  } catch (error) {
    console.error('Error in getPopularFindings:', error)
    throw error
  }
}

export default getPool()

