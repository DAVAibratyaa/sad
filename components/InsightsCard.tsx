import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { BrainCog, BookOpen, ArrowRight } from 'lucide-react'

interface InsightCardProps {
  title: string
  description: string
  implication: string
  citation?: string
}

export function InsightCard({ title, description, implication, citation }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white leading-tight">{title}</h3>
          </div>
          
          {/* Content Section */}
          <div className="p-4 space-y-4">
            {/* Description */}
            <div className="text-gray-300 text-sm leading-relaxed">
              {description}
            </div>
            
            {/* Implication */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BrainCog className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Implicação</span>
              </div>
              <p className="text-gray-300 text-sm">
                {implication}
              </p>
            </div>
            
            {/* Citation */}
            {citation && (
              <div className="border-t border-gray-700/50 pt-3">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-blue-400 text-xs font-medium block mb-1">Citação</span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {citation}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Interactive Elements */}
            <div className="pt-2">
              <Badge 
                variant="outline" 
                className="bg-emerald-900/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  Ver detalhes
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

