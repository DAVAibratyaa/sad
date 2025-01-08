import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface LogicStep {
  title: string
  description: string
  implication: string
  citation: string
}

interface StructuredLogicDisplayProps {
  logica: string
}

export function StructuredLogicDisplay({ logica }: StructuredLogicDisplayProps) {
  const parseLogicSteps = (logicaString: string): LogicStep[] => {
    const stepRegex = /<step\d+>([\s\S]*?)<\/step\d+>/g
    const titleRegex = /<title>([\s\S]*?)<\/title>/
    const descriptionRegex = /<description>([\s\S]*?)<\/description>/
    const implicationRegex = /<implication>([\s\S]*?)<\/implication>/
    const citationRegex = /<citation>([\s\S]*?)<\/citation>/

    const steps: LogicStep[] = []
    let match

    while ((match = stepRegex.exec(logicaString)) !== null) {
      const stepContent = match[1]
      const title = titleRegex.exec(stepContent)?.[1] || ''
      const description = descriptionRegex.exec(stepContent)?.[1] || ''
      const implication = implicationRegex.exec(stepContent)?.[1] || ''
      const citation = citationRegex.exec(stepContent)?.[1] || ''

      steps.push({ title, description, implication, citation })
    }

    return steps
  }

  const logicSteps = parseLogicSteps(logica)

  return (
    <div className="space-y-6">
      {logicSteps.map((step, index) => (
        <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {step.title}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-indigo-400">Implicação:</span> {step.implication}
                </p>
              </div>
              {step.citation && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-semibold text-blue-400">Citação/Referência:</span> {step.citation}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

