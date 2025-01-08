"use client"

import { useMemo, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from '@/contexts/DataContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react'

const correctExamName = (name: string) => {
  return name
    .replace('Abdomen', 'Abdôme')
    .replace('Pelvico', 'Pélvico')
    .replace('Musculo-esqueletico', 'Músculo-esquelético');
};

export function PopularExamsChart() {
  const { popularExams = [] } = useData()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const chartData = useMemo(() => {
    return [...popularExams]
      .sort((a, b) => sortOrder === 'desc' ? b.count - a.count : a.count - b.count)
      .slice(0, 5)
      .map((exam) => ({
        name: correctExamName(exam.name),
        count: exam.count,
        fill: 'hsl(var(--primary))',
      }))
  }, [popularExams, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-muted-foreground">{`Total: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-muted-foreground" />
          Exames Mais Populares
        </CardTitle>
        <button
          onClick={toggleSortOrder}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {sortOrder === 'desc' ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                type="number"
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    opacity={hoveredIndex === index ? 0.8 : 0.5}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
                <LabelList 
                  dataKey="count" 
                  position="right" 
                  fill="hsl(var(--foreground))"
                  className="text-sm"
                />
              </Bar>
              <AnimatePresence>
                {hoveredIndex !== null && (
                  <motion.rect
                    key={`highlight-${hoveredIndex}`}
                    x={0}
                    y={hoveredIndex * 60}
                    width="100%"
                    height={60}
                    fill="hsl(var(--muted))"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

