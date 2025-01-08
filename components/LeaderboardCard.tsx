"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LeaderboardItem {
  name: string
  count: number
}

interface LeaderboardCardProps {
  title: string
  data: LeaderboardItem[]
  icon: React.ReactNode
}

export function LeaderboardCard({ title, data, icon }: LeaderboardCardProps) {
  return (
    <Card className="bg-vercel-darker border-vercel-dark shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <ul className="divide-y divide-vercel-dark">
            {data.slice(0, 5).map((item, index) => (
              <li key={item.name} className="flex justify-between items-center text-white p-3 hover:bg-vercel-dark transition-all duration-200">
                <span className="flex items-center gap-2">
                  <span className="text-vercel-silver font-semibold text-sm">{index + 1}.</span>
                  <span className="text-sm truncate max-w-[150px] sm:max-w-none">{item.name}</span>
                </span>
                <span className="text-white font-semibold text-sm">{item.count}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

