"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useData } from '@/contexts/DataContext'
import { eachDayOfInterval, format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity } from 'lucide-react'

export default function Heatmap() {
  const { activityData } = useData()

  const today = new Date()
  const startDate = subDays(today, 364)
  const dateRange = eachDayOfInterval({ start: startDate, end: today })

  const activityMap = new Map(
    activityData.map(item => [item.date, item.count])
  )

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-900'
    if (count < 5) return 'bg-emerald-900'
    if (count < 10) return 'bg-emerald-700'
    if (count < 15) return 'bg-emerald-500'
    return 'bg-emerald-400'
  }

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          Atividade Anual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
          <TooltipProvider>
            {dateRange.map(date => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const count = activityMap.get(dateStr) || 0
              return (
                <Tooltip key={dateStr}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        aspect-square w-full
                        ${getColor(count)}
                        rounded-sm
                        transition-all duration-200
                        hover:scale-110
                      `}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">
                        {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p className="text-muted-foreground">
                        {count} laudo{count !== 1 ? 's' : ''} gerado{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>{format(startDate, 'MMM yyyy', { locale: ptBR })}</span>
          <span>{format(today, 'MMM yyyy', { locale: ptBR })}</span>
        </div>
      </CardContent>
    </Card>
  )
}

