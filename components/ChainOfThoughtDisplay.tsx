import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Brain } from 'lucide-react'

interface ChainOfThoughtDisplayProps {
  thinking: string
}

export function ChainOfThoughtDisplay({ thinking }: ChainOfThoughtDisplayProps) {
  const steps = thinking.split('\n').filter(step => step.trim() !== '')

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
        <Brain className="w-6 h-6" />
        Análise do Raciocínio
      </h2>
      {steps.map((step, index) => (
        <Card key={index} className="bg-[#222] border-[#3A3A3A]">
          <CardContent className="p-4">
            <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

