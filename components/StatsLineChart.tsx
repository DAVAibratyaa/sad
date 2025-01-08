"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChartData {
  date: string
  value: number
}

interface StatsLineChartProps {
  data: ChartData[]
}

export function StatsLineChart({ data }: StatsLineChartProps) {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, 'd MMM', { locale: ptBR })
  }

  const formatTooltipDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-vercel-darker border border-vercel-dark p-3 rounded-xl shadow-md">
          <p className="text-vercel-silver mb-1 text-xs">{`Data: ${formatTooltipDate(label)}`}</p>
          <p className="text-white font-bold text-base">{`Relatórios: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={formatDate}
            tick={{ fill: '#666' }}
            interval="preserveStartEnd"
            minTickGap={10}
          />
          <YAxis 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
            tick={{ fill: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#FFFFFF" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#111' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

