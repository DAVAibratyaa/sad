import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Wand2 } from 'lucide-react'
import { generateReport } from '@/lib/api'

interface AIAssistedFindingsExpansionProps {
  initialFindings: string
  onExpand: (expandedFindings: string) => void
}

export function AIAssistedFindingsExpansion({ initialFindings, onExpand }: AIAssistedFindingsExpansionProps) {
  const [expandedFindings, setExpandedFindings] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleExpand = async () => {
    setIsLoading(true)
    try {
      const response = await generateReport('AI Findings Expansion', initialFindings)
      if (response.data && response.data.generatedReport) {
        setExpandedFindings(response.data.generatedReport)
        onExpand(response.data.generatedReport)
      }
    } catch (error) {
      console.error('Error expanding findings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-vercel-darker border-vercel-dark shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-black pb-4">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          AI-Assisted Findings Expansion
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Textarea
          value={expandedFindings || initialFindings}
          onChange={(e) => setExpandedFindings(e.target.value)}
          className="min-h-[150px] text-sm bg-black border-vercel-dark text-white placeholder-vercel-silver focus:ring-2 focus:ring-white/10 transition-all rounded-lg"
          placeholder="Expanded findings will appear here..."
        />
        <Button
          onClick={handleExpand}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-200 text-black transition-all duration-200 text-sm py-2 rounded-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Expanding Findings...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Expand Findings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

