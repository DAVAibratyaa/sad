import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Eye, Edit2, Save, RotateCcw, Download } from 'lucide-react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import medicalTerms from '@/lib/medical-terms'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Carregando Editor...</p>,
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  syntax: {
    highlight: (text: string) => {
      return text.replace(new RegExp(medicalTerms.join('|'), 'gi'), (match) => {
        return `<span class="medical-term">${match}</span>`
      })
    },
  },
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
]

interface EnhancedReportEditorProps {
  initialContent: string
  onSave: (content: string) => void
}

export function EnhancedReportEditor({ initialContent, onSave }: EnhancedReportEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [editMode, setEditMode] = useState(false)
  const [originalContent, setOriginalContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
    setOriginalContent(initialContent)
  }, [initialContent])

  const handleSave = () => {
    onSave(content)
    setEditMode(false)
  }

  const handleRevert = () => {
    setContent(originalContent)
    setEditMode(false)
  }

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio_radiologico.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <Eye className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
            {editMode ? 'Visualizar' : 'Editar'}
          </Button>
          {editMode && (
            <>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={handleRevert}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reverter
              </Button>
            </>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="report">Relatório</TabsTrigger>
          <TabsTrigger value="highlighted">Termos Destacados</TabsTrigger>
        </TabsList>
        <TabsContent value="report">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {editMode ? (
              <QuillNoSSRWrapper
                modules={modules}
                formats={formats}
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-gray-800 text-white"
              />
            ) : (
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="highlighted">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <SyntaxHighlighter
              language="plaintext"
              style={atomOneDark}
              customStyle={{ background: 'transparent' }}
            >
              {content}
            </SyntaxHighlighter>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

