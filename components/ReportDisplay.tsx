'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from 'react-markdown'
import { Report } from "@/lib/types"
import { Share2, FileText, Copy, Check, AlertTriangle, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StructuredLogicDisplay } from './StructuredLogicDisplay'
import { StructuredDiscussionDisplay } from './StructuredDiscussionDisplay'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface ReportDisplayProps {
  report: Report
  onNewReport: () => void
}

export function ReportDisplay({ report, onNewReport }: ReportDisplayProps) {
  const [activeTab, setActiveTab] = useState('insights')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (report && !report.error) {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [report])

  useEffect(() => {
    if (report && report.error) {
      console.error('Report error:', report.error);
      setError(report.error);
    } else if (!report || !report.generatedReport) {
      console.error('No report content');
      setError('No report content received');
    } else {
      setError(null);
    }
  }, [report]);

  const handleCopy = () => {
    if (report && report.generatedReport) {
      navigator.clipboard.writeText(report.generatedReport)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const parseStructuredContent = (content: string | undefined, tag: string) => {
    if (!content) return [];
    const regex = new RegExp(`<${tag}(\\d+)>([\\s\\S]*?)</${tag}\\1>`, 'g');
    const matches = [...content.matchAll(regex)];
    return matches.map(match => {
      const [, , innerContent] = match;
      const titleMatch = innerContent.match(/<title>([\s\S]*?)<\/title>/);
      const descriptionMatch = innerContent.match(/<description>([\s\S]*?)<\/description>/);
      const implicationMatch = innerContent.match(/<implication>([\s\S]*?)<\/implication>/);
      const citationMatch = innerContent.match(/<citation>([\s\S]*?)<\/citation>/);
      return {
        title: titleMatch ? titleMatch[1] : '',
        description: descriptionMatch ? descriptionMatch[1] : '',
        implication: implicationMatch ? implicationMatch[1] : '',
        citation: citationMatch ? citationMatch[1] : undefined
      };
    });
  };

  const logicaSteps = useMemo(() => parseStructuredContent(report?.logica, 'step'), [report?.logica]);
  const insights = useMemo(() => parseStructuredContent(report?.aiInsights, 'insight'), [report?.aiInsights]);

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-500/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="w-6 h-6" />
            Erro ao Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300 mb-4">{error}</p>
          <Button
            onClick={onNewReport}
            variant="outline"
            className="bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20 transition-colors duration-200"
          >
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-fadeIn bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl" ref={reportRef}>
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 py-6 px-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7" />
            Laudo Radiológico
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-9 px-4 text-sm bg-gray-800/50 text-gray-200 border-gray-600 hover:bg-gray-700/50 transition-colors duration-200"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Laudo
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewReport}
              className="h-9 px-4 text-sm bg-gray-800/50 text-gray-200 border-gray-600 hover:bg-gray-700/50 transition-colors duration-200"
            >
              Novo Laudo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 bg-gray-800/50 text-gray-200 border-gray-600 hover:bg-gray-700/50 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex h-14 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
            {['insights', 'logica', 'laudo', 'impressions', 'differential', 'followup', 'discussion'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-grow h-full text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800/50 transition-all duration-200 hover:bg-gray-800/30"
                style={{
                  display: (tab === 'impressions' && !report?.impressions) ||
                           (tab === 'differential' && !report?.differentialDiagnosis) ||
                           (tab === 'followup' && !report?.followUpRecommendations) ||
                           (tab === 'logica' && !report?.logica)
                           ? 'none' : 'flex'
                }}
              >
                {tab === 'logica' ? (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Lógica
                  </>
                ) : (
                  tab.charAt(0).toUpperCase() + tab.slice(1)
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] max-h-[800px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <TabsContent value="insights" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Insights Avançados</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {insights.map((insight, index) => (
                        <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg">
                          <CardContent className="p-5">
                            <h4 className="text-lg font-semibold text-white mb-3">{insight.title}</h4>
                            <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                            <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                              <p className="text-gray-300 text-sm">
                                <span className="font-semibold text-blue-400">Implicação:</span> {insight.implication}
                              </p>
                            </div>
                            {insight.citation && (
                              <div className="text-sm text-gray-400">
                                <span className="font-semibold text-blue-400">Referência:</span> {insight.citation}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logica" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Lógica de Análise</h3>
                    <StructuredLogicDisplay logica={report?.logica || ''} />
                  </div>
                </TabsContent>

                <TabsContent value="laudo" className="mt-0">
                  <div className={`space-y-6 ${inter.className}`}>
                    <h3 className="text-xl font-semibold text-white mb-4">Laudo Completo</h3>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-lg">
                      <CardContent className="p-5">
                        <pre className="whitespace-pre-wrap text-sm text-gray-300 font-inter">{report?.generatedReport || 'Conteúdo do laudo não disponível'}</pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {report?.impressions && (
                  <TabsContent value="impressions" className="mt-0">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Impressões</h3>
                      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-lg">
                        <CardContent className="p-5">
                          <div className="text-sm prose prose-invert max-w-none text-gray-300">
                            <ReactMarkdown>{report.impressions}</ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )}

                {report?.differentialDiagnosis && (
                  <TabsContent value="differential" className="mt-0">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Diagnóstico Diferencial</h3>
                      <StructuredDiscussionDisplay 
                        content={report.differentialDiagnosis} 
                        type="ddx"
                      />
                    </div>
                  </TabsContent>
                )}

                {report?.followUpRecommendations && (
                  <TabsContent value="followup" className="mt-0">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Recomendações de Acompanhamento</h3>
                      <StructuredDiscussionDisplay 
                        content={report.followUpRecommendations} 
                        type="recommendations"
                      />
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="discussion" className="mt-0">
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Discussão Clínica</h3>
                    {report?.differentialDiagnosis && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Diagnóstico Diferencial</h4>
                        <StructuredDiscussionDisplay 
                          content={report.differentialDiagnosis} 
                          type="ddx" 
                        />
                      </div>
                    )}
                    {report?.followUpRecommendations && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Recomendações de Acompanhamento</h4>
                        <StructuredDiscussionDisplay 
                          content={report.followUpRecommendations} 
                          type="recommendations" 
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
interface Report {
  generatedReport: string;
  aiInsights: string;
  impressions: string;
  differentialDiagnosis: string;
  followUpRecommendations: string;
  logica: string;
  error: string | null;
}

