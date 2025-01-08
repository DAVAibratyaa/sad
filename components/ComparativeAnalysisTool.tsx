import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, GitCompare } from 'lucide-react'
import { generateReport } from '@/lib/api'

interface ComparativeAnalysisToolProps {
  currentFindings: string
  onAnalysis: (analysis: string) => void
}

export function ComparativeAnalysisTool({ currentFindings, onAnalysis }: ComparativeAnalysisToolProps) {
  const [previousFindings, setPreviousFindings] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalysis = async () => {
    setIsLoading(true)
    try {
      const prompt = `Compare the following current findings with the previous findings:

Current Findings:
${currentFindings}

Previous Findings:
${previousFindings}

Provide a detailed analysis of the changes, improvements, or deteriorations observed.`

      const response = await generateReport('Comparative Analysis', prompt)
      if (response.data && response.data.generatedReport) {
        setAnalysis(response.data.generatedReport)
        onAnalysis(response.data.generatedReport)
      }
    } catch (error) {
      console.error('Error performing comparative analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-vercel-darker border-vercel-dark shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-black pb-4">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          Comparative Analysis Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Textarea
          value={previousFindings}
          onChange={(e) => setPreviousFindings(e.target.value)}
          className="min-h-[100px] text-sm bg-black border-vercel-dark text-white placeholder-vercel-silver focus:ring-2 focus:ring-white/10 transition-all rounded-lg"
          placeholder="Enter previous findings here..."
        />
        <Textarea
          value={analysis}
          readOnly
          className="min-h-[150px] text-sm bg-black border-vercel-dark text-white placeholder-vercel-silver focus:ring-2 focus:ring-white/10 transition-all rounded-lg"
          placeholder="Comparative analysis will appear here..."
        />
        <Button
          onClick={handleAnalysis}
          disabled={isLoading || !previousFindings}
          className="w-full bg-white hover:bg-gray-200 text-black transition-all duration-200 text-sm py-2 rounded-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <GitCompare className="mr-2 h-4 w-4" />
              Perform Comparative Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

