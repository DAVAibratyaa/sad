import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useData } from '@/contexts/DataContext'
import { subDays, format, eachDayOfInterval, startOfYear, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const NeonHeatmap: React.FC = () => {
  const { activityData } = useData()

  const heatmapData = useMemo(() => {
    const startDate = startOfYear(new Date(2025, 0, 1))
    const endDate = addDays(startDate, 364)
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    const activityMap = new Map(activityData.map(item => [item.date, item.count]))

    return dateRange.map(date => ({
      date,
      count: activityMap.get(format(date, 'yyyy-MM-dd')) || 0
    }))
  }, [activityData])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800'
    if (count < 5) return 'bg-green-500'
    if (count < 10) return 'bg-green-400'
    if (count < 15) return 'bg-green-300'
    return 'bg-green-200'
  }

  const getNeonEffect = (count: number) => {
    if (count === 0) return ''
    return 'shadow-lg shadow-green-500/50'
  }

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Atividade Anual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
          {heatmapData.map(({ date, count }) => (
            <TooltipProvider key={date.toISOString()}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`w-3 h-3 rounded-sm ${getColor(count)} ${getNeonEffect(count)} transition-all duration-200 hover:scale-150`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    <p className="font-medium">{format(date, 'dd/MM/yyyy', { locale: ptBR })}</p>
                    <p>{count} relatório{count !== 1 ? 's' : ''}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>{format(heatmapData[0].date, 'MMM yyyy', { locale: ptBR })}</span>
          <span>{format(heatmapData[heatmapData.length - 1].date, 'MMM yyyy', { locale: ptBR })}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default NeonHeatmap

