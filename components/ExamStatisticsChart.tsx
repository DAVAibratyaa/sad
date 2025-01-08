"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Microscope, Search, BarChart2 } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { Input } from "@/components/ui/input"

// Custom color palette
const COLORS = [
  '#60A5FA', // blue-400
  '#34D399', // emerald-400
  '#FBBF24', // amber-400
  '#F87171', // red-400
  '#A78BFA', // violet-400
  '#4ADE80', // green-400
  '#F472B6', // pink-400
  '#2DD4BF', // teal-400
  '#FB923C', // orange-400
  '#818CF8', // indigo-400
]

export function ExamStatisticsChart() {
  const [activeView, setActiveView] = useState("exams")
  const [searchTerm, setSearchTerm] = useState("")
  const { popularExams, popularFindings } = useData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 p-4 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
            <p className="text-white/80 text-sm">
              {payload[0].value} {payload[0].value === 1 ? 'exame' : 'exames'}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Filter and process data
  const processData = (data: any[]) => {
    return data
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
      }))
  }

  const data = activeView === "exams" ? processData(popularExams) : processData(popularFindings)

  return (
    <Card className="bg-black border-white/10">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg text-white">Estatísticas de Exames (2025-2026)</CardTitle>
          </div>
          <Tabs value={activeView} onValueChange={setActiveView} className="flex-shrink-0">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger 
                value="exams"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Exames
              </TabsTrigger>
              <TabsTrigger 
                value="findings"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Microscope className="h-4 w-4 mr-2" />
                Achados
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder-white/40"
          />
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-[500px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  horizontal={false} 
                  stroke="rgba(255,255,255,0.1)" 
                />
                <XAxis 
                  type="number" 
                  stroke="#666"
                  tickFormatter={(value) => value.toString()}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={200}
                  stroke="#666"
                  tick={({ x, y, payload }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={-10}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#fff"
                        fontSize="12"
                        opacity={0.7}
                      >
                        {payload.value}
                      </text>
                    </g>
                  )}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

