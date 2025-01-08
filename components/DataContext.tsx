import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchActivityData, fetchPopularExams, fetchPopularFindings, fetchRecentReports, updateGlobalStats } from '@/lib/api'

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

interface DataContextType {
  activityData: { date: string; count: number }[]
  popularExams: { name: string; count: number }[]
  popularFindings: { name: string; count: number }[]
  recentReports: { id: number; examType: string; createdAt: string }[]
  reportsGenerated: { date: string; value: number }[]
  updateData: () => Promise<void>
  incrementReportCount: () => void
  error: Error | null
  updateStatistics: (examType: string, findings: string) => Promise<void>
  lastUpdated: Date
}

const defaultContextValue: DataContextType = {
  activityData: [],
  popularExams: [],
  popularFindings: [],
  recentReports: [],
  reportsGenerated: [],
  updateData: async () => {},
  incrementReportCount: () => {},
  error: null,
  updateStatistics: async () => {},
  lastUpdated: new Date()
}

const DataContext = createContext<DataContextType>(defaultContextValue)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([])
  const [popularExams, setPopularExams] = useState<{ name: string; count: number }[]>([])
  const [popularFindings, setPopularFindings] = useState<{ name: string; count: number }[]>([])
  const [recentReports, setRecentReports] = useState<{ id: number; examType: string; createdAt: string }[]>([])
  const [reportsGenerated, setReportsGenerated] = useState<{ date: string; value: number }[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateData = async () => {
    try {
      const [activityData, popularExamsData, popularFindingsData, recentReportsData] = await Promise.all([
        fetchActivityData(),
        fetchPopularExams(),
        fetchPopularFindings(),
        fetchRecentReports()
      ])
      setActivityData(activityData || [])
      setPopularExams(popularExamsData || [])
      setPopularFindings(popularFindingsData || [])
      setReportsGenerated((activityData || []).map(item => ({ date: item.date || '', value: item.count || 0 })))
      setRecentReports(recentReportsData || [])
      setLastUpdated(new Date());
      setError(null)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error : new Error('An unknown error occurred'))
    }
  }

  const incrementReportCount = () => {
    setReportsGenerated(prev => {
      const today = new Date().toISOString().split('T')[0]
      const updatedData = [...prev]
      const todayIndex = updatedData.findIndex(item => item.date === today)
      if (todayIndex !== -1) {
        updatedData[todayIndex] = { ...updatedData[todayIndex], value: updatedData[todayIndex].value + 1 }
      } else {
        updatedData.push({ date: today, value: 1 })
      }
      return updatedData
    })
    // Trigger immediate data refresh after increment
    updateData();
  }

  const updateStatistics = async (examType: string, findings: string) => {
    try {
      await updateGlobalStats();
      const [activityData, popularExamsData, popularFindingsData, recentReportsData] = await Promise.all([
        fetchActivityData(),
        fetchPopularExams(),
        fetchPopularFindings(),
        fetchRecentReports()
      ]);
      setActivityData(activityData || []);
      setPopularExams(popularExamsData || []);
      setPopularFindings(popularFindingsData || []);
      setReportsGenerated((activityData || []).map(item => ({ date: item.date || '', value: item.count || 0 })));
      setRecentReports(recentReportsData || []);

      // Corrigir formatação do nome do exame
      const correctedExamType = examType
        .replace('Abdomen', 'Abdome')
        .replace('Pelvico', 'Pélvico')
        .replace('Musculo-esqueletico', 'Músculo-esquelético');

      // Atualizar estatísticas de tipo de exame
      setPopularExams(prevExams => {
        const updatedExams = [...prevExams];
        const examIndex = updatedExams.findIndex(exam => exam.name.toLowerCase() === correctedExamType.toLowerCase());
        if (examIndex !== -1) {
          updatedExams[examIndex] = { ...updatedExams[examIndex], count: updatedExams[examIndex].count + 1 };
        } else {
          updatedExams.push({ name: correctedExamType, count: 1 });
        }
        return updatedExams.sort((a, b) => b.count - a.count);
      });

      // Atualizar estatísticas de achados
      const newFindings = findings.split(',').map(finding => finding.trim());
      setPopularFindings(prevFindings => {
        const updatedFindings = [...prevFindings];
        newFindings.forEach(finding => {
          const findingIndex = updatedFindings.findIndex(f => f.name.toLowerCase() === finding.toLowerCase());
          if (findingIndex !== -1) {
            updatedFindings[findingIndex] = { ...updatedFindings[findingIndex], count: updatedFindings[findingIndex].count + 1 };
          } else {
            updatedFindings.push({ name: finding, count: 1 });
          }
        });
        return updatedFindings.sort((a, b) => b.count - a.count);
      });

      setError(null);
    } catch (error) {
      console.error("Error updating statistics:", error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  };

  useEffect(() => {
    // Initial data fetch
    updateData();

    // Set up interval for periodic updates (15 minutes)
    const intervalId = setInterval(updateData, 15 * 60 * 1000);

    // Add event listener for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <DataContext.Provider value={{ 
      activityData, 
      popularExams, 
      popularFindings, 
      recentReports, 
      reportsGenerated, 
      updateData,
      incrementReportCount,
      error,
      updateStatistics,
      lastUpdated
    }}>
      {children}
    </DataContext.Provider>
  )
}

