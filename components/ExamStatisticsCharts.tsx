"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/contexts/DataContext'

export function ExamStatisticsCharts() {
  const { popularFindings } = useData()

  const findingsData = popularFindings
    .slice(0, 5)
    .map((finding) => ({
      name: finding.name,
      count: finding.count,
      fill: 'hsl(var(--primary))'
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 px-3 py-2 rounded-lg border border-gray-800">
          <p className="text-sm text-white">
            {label}: {payload[0].value} exame(s)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={findingsData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="hsl(var(--foreground))"
            fontSize={10}
            tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

