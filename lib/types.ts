export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  reportsGenerated: number;
}

export interface Report {
  id: string;
  userId: string;
  examType: string;
  findings: string;
  generatedReport: string;
  thinking: string;
  aiInsights: string;
  logica: string;
  impressions?: string;
  createdAt: string;
  error?: string;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  reportsGenerated: number;
}

export interface MedicalReport {
  date: string;
  count: number;
}

export interface MonthLabel {
  month: string;
  position: number;
}

export interface DataContextType {
  lastUpdated: Date;
}

export interface Template {
  id: string
  name: string
  content: string
  category?: string
  tags?: string[]
  folder?: string
}

