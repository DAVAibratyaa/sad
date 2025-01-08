'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FindingBadge } from "./FindingBadge"
import { Stethoscope } from 'lucide-react'

interface Finding {
  text: string
  reasoning: string
}

interface ReportSectionProps {
  title: string
  findings: Finding[]
  keywords?: string[]
}

export function ReportSection({ title, findings, keywords }: ReportSectionProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-200">
          <Stethoscope className="h-5 w-5 text-emerald-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {findings.map((finding, index) => (
            <FindingBadge
              key={index}
              finding={finding.text}
              reasoning={finding.reasoning}
              keywords={keywords}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

