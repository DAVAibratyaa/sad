import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Stethoscope, ArrowRight, AlertTriangle } from 'lucide-react'

interface DiscussionItem {
  diagnosis?: string
  reasoning?: string
  probability?: string
  keyfindings?: string
  timeframe?: string
  action?: string
  rationale?: string
  alternative?: string
}

interface StructuredDiscussionDisplayProps {
  content: string
  type: 'ddx' | 'recommendations'
}

export function StructuredDiscussionDisplay({ content, type }: StructuredDiscussionDisplayProps) {
  const parseDiscussionItems = (discussionString: string): DiscussionItem[] => {
    const itemRegex = type === 'ddx' 
      ? /<ddx\d+>([\s\S]*?)<\/ddx\d+>/g
      : /<rec\d+>([\s\S]*?)<\/rec\d+>/g;
    
    const matches = [...discussionString.matchAll(itemRegex)];
    
    return matches.map(match => {
      const content = match[1];
      const item: DiscussionItem = {};
      
      if (type === 'ddx') {
        const diagnosisMatch = content.match(/<diagnosis>([\s\S]*?)<\/diagnosis>/);
        const reasoningMatch = content.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
        const probabilityMatch = content.match(/<probability>([\s\S]*?)<\/probability>/);
        const keyfindingsMatch = content.match(/<keyfindings>([\s\S]*?)<\/keyfindings>/);
        
        item.diagnosis = diagnosisMatch?.[1];
        item.reasoning = reasoningMatch?.[1];
        item.probability = probabilityMatch?.[1];
        item.keyfindings = keyfindingsMatch?.[1];
      } else {
        const timeframeMatch = content.match(/<timeframe>([\s\S]*?)<\/timeframe>/);
        const actionMatch = content.match(/<action>([\s\S]*?)<\/action>/);
        const rationaleMatch = content.match(/<rationale>([\s\S]*?)<\/rationale>/);
        const alternativeMatch = content.match(/<alternative>([\s\S]*?)<\/alternative>/);
        
        item.timeframe = timeframeMatch?.[1];
        item.action = actionMatch?.[1];
        item.rationale = rationaleMatch?.[1];
        item.alternative = alternativeMatch?.[1];
      }
      
      return item;
    });
  };

  const items = parseDiscussionItems(content);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardContent className="p-4">
            {type === 'ddx' ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.diagnosis}</h4>
                    <p className="text-blue-200 text-sm">{item.probability}</p>
                  </div>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-gray-300 text-sm">{item.reasoning}</p>
                  <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                    <p className="text-blue-200 text-sm">{item.keyfindings}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.timeframe}</h4>
                    <p className="text-emerald-200 text-sm">{item.action}</p>
                  </div>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-gray-300 text-sm">{item.rationale}</p>
                  {item.alternative && (
                    <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">Alternativa</span>
                      </div>
                      <p className="text-emerald-200 text-sm">{item.alternative}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

