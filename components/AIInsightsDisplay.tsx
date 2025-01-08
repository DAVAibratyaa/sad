import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain } from 'lucide-react'
import { InsightCard } from "./InsightCard"

interface AIInsightsDisplayProps {
  insights: string
}

interface ParsedInsight {
  title: string
  description: string
  implication: string
  citation?: string
}

export function AIInsightsDisplay({ insights }: AIInsightsDisplayProps) {
  const parseInsights = (insightsString: string): ParsedInsight[] => {
    const insightRegex = /<insight\d+>([\s\S]*?)<\/insight\d+>/g
    const matches = [...insightsString.matchAll(insightRegex)]
    
    return matches.map(match => {
      const content = match[1]
      const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/)
      const descriptionMatch = content.match(/<description>([\s\S]*?)<\/description>/)
      const implicationMatch = content.match(/<implication>([\s\S]*?)<\/implication>/)
      const citationMatch = content.match(/<citation>([\s\S]*?)<\/citation>/)
      
      return {
        title: titleMatch?.[1] || '',
        description: descriptionMatch?.[1] || '',
        implication: implicationMatch?.[1] || '',
        citation: citationMatch?.[1]
      }
    })
  }

  const parsedInsights = parseInsights(insights)

  return (
    <Card className="bg-black border-gray-800 shadow-2xl">
      <CardHeader className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Brain className="h-6 w-6 text-emerald-500" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            Insights Radiológicos Avançados
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {parsedInsights.map((insight, index) => (
              <InsightCard
                key={index}
                title={insight.title}
                description={insight.description}
                implication={insight.implication}
                citation={insight.citation}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

