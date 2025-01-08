"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useData } from '@/contexts/DataContext'

const { popularFindings } = useData()

const data = popularFindings.slice(0,5)


export function PopularFindingsChart() {
  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Achados Mais Comuns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              "Nódulo Pulmonar": {
                label: "Nódulo Pulmonar",
                color: "hsl(var(--chart-4))",
              },
              "Fratura": {
                label: "Fratura",
                color: "hsl(var(--chart-5))",
              },
              "Derrame Pleural": {
                label: "Derrame Pleural",
                color: "hsl(var(--chart-6))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {popularFindings.slice(0,3).map((finding, index) => (
                  <Line type="monotone" dataKey="count" name={finding.name} stroke={`var(--color-chart-${index + 4})`} strokeWidth={2} dot={false} key={finding.name}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

