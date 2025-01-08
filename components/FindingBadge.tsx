'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BrainCog } from 'lucide-react'

interface FindingBadgeProps {
  finding: string
  reasoning: string
  keywords?: string[]
}

export function FindingBadge({ finding, reasoning, keywords = [] }: FindingBadgeProps) {
  const [isActive, setIsActive] = useState(false)

  const highlightKeywords = (text: string) => {
    if (!keywords.length) return text

    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
    return text.split(regex).map((part, i) => {
      if (keywords.some(keyword => part.toLowerCase() === keyword.toLowerCase())) {
        return <span key={i} className="text-emerald-400 font-medium">{part}</span>
      }
      return part
    })
  }

  return (
    <div className="relative group">
      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer transition-all duration-300 text-base py-2 px-4 hover:bg-emerald-950/30 hover:border-emerald-600/50",
          isActive && "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
        )}
        onClick={() => setIsActive(!isActive)}
      >
        {highlightKeywords(finding)}
      </Badge>
      
      {isActive && (
        <Card className="absolute left-0 top-full mt-2 z-10 bg-gray-900/95 border-gray-800 p-4 w-[300px] backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          <div className="flex items-start gap-2 text-emerald-400 mb-2">
            <BrainCog className="h-4 w-4 mt-1" />
            <span className="font-semibold">Raciocínio Clínico</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {highlightKeywords(reasoning)}
          </p>
        </Card>
      )}
    </div>
  )
}

