'use client'

import { motion } from "framer-motion"
import { Lightbulb, Stethoscope, Calendar } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AISelectorProps {
  includeImpressions: boolean
  includeDifferentialDiagnosis: boolean
  includeFollowUpRecommendations: boolean
  onChangeImpressions: (value: boolean) => void
  onChangeDifferentialDiagnosis: (value: boolean) => void
  onChangeFollowUpRecommendations: (value: boolean) => void
}

export function AIOptionsSelector({
  includeImpressions,
  includeDifferentialDiagnosis,
  includeFollowUpRecommendations,
  onChangeImpressions,
  onChangeDifferentialDiagnosis,
  onChangeFollowUpRecommendations
}: AISelectorProps) {
  return (
    <Card className="bg-gradient-to-br from-black via-gray-900 to-gray-800 border-white/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Opções de IA</h3>
        <div className="space-y-4">
          <AIOption
            icon={<Lightbulb className="h-5 w-5" />}
            label="Gerar Impressões"
            description="A IA irá gerar uma seção de impressões diagnósticas"
            isSelected={includeImpressions}
            onChange={onChangeImpressions}
          />
          <AIOption
            icon={<Stethoscope className="h-5 w-5" />}
            label="Diagnóstico Diferencial"
            description="A IA irá sugerir possíveis diagnósticos diferenciais"
            isSelected={includeDifferentialDiagnosis}
            onChange={onChangeDifferentialDiagnosis}
          />
          <AIOption
            icon={<Calendar className="h-5 w-5" />}
            label="Recomendações de Seguimento"
            description="A IA irá sugerir recomendações para acompanhamento"
            isSelected={includeFollowUpRecommendations}
            onChange={onChangeFollowUpRecommendations}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface AIOptionProps {
  icon: React.ReactNode
  label: string
  description: string
  isSelected: boolean
  onChange: (value: boolean) => void
}

function AIOption({ icon, label, description, isSelected, onChange }: AIOptionProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center space-x-4 rounded-xl border p-4 cursor-pointer transition-all duration-300",
        isSelected
          ? "border-yellow-400/50 bg-yellow-400/5"
          : "border-white/10 hover:border-yellow-400/30 hover:bg-yellow-400/5"
      )}
      onClick={() => onChange(!isSelected)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn(
        "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
        isSelected ? "bg-yellow-400/20" : "bg-white/10"
      )}>
        {icon}
      </div>
      <div className="flex-grow">
        <Label className="text-sm font-medium text-white cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-white/60 mt-1">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0">
        <motion.div
          initial={false}
          animate={{
            scale: isSelected ? 1 : 0.8,
            opacity: isSelected ? 1 : 0.5
          }}
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center",
            isSelected ? "border-yellow-400 bg-yellow-400" : "border-white/20"
          )}
        >
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-4 w-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

