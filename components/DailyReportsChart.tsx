"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useData } from '@/contexts/DataContext'

const { reportsGenerated } = useData()

const data = reportsGenerated.slice(-7)


export function DailyReportsChart() {
  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Laudos Gerados por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              reports: {
                label: "Laudos",
                color: "hsl(var(--chart-7))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" name="Laudos" stroke="var(--color-chart-7)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

