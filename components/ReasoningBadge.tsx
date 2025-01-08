'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReasoningBadgeProps {
  reasoning: string
}

export function ReasoningBadge({ reasoning }: ReasoningBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        className="bg-white/10 text-white border-[#222222] hover:bg-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        Ver Raciocínio
      </Button>
      
      {isOpen && (
        <Card className="absolute left-0 top-full mt-2 z-50 bg-[#111111]/95 border-[#222222] p-4 w-[300px] backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          <pre className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {reasoning}
          </pre>
        </Card>
      )}
    </div>
  )
}

