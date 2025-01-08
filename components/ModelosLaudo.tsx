'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, FileText, Search, ArrowRightLeft, FolderOpen, ChevronRight, Eye, X, FolderPlus, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { defaultTemplates } from '@/lib/defaultTemplates'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Template {
  id: string
  name: string
  content: string
  category?: string
  tags?: string[]
  folder?: string
}

interface Folder {
  id: string
  name: string
  parentId?: string
}

interface ModelosLaudoProps {
  templates: Template[]
  onSelectModelo: (content: string, name: string) => void
  onToggleFavorito: (modeloId: string) => void
  modelosFavoritos: string[]
  onTransferToQuick: (template: Template) => void
  selectedTemplates: string[]
}

export function ModelosLaudo({ 
  templates, 
  onSelectModelo, 
  onToggleFavorito, 
  modelosFavoritos, 
  onTransferToQuick, 
  selectedTemplates 
}: ModelosLaudoProps) {
  const [activeTab, setActiveTab] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'protocolos', name: 'Protocolos' },
    { id: 'geral', name: 'Geral' }
  ])
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [showNewModelDialog, setShowNewModelDialog] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelContent, setNewModelContent] = useState('');
  const [selectedModelForTransfer, setSelectedModelForTransfer] = useState<Template | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  useEffect(() => {
    const categorizedDefaults = defaultTemplates.map(template => ({
      ...template,
      category: getCategoryFromName(template.name),
      folder: getFolderFromName(template.name)
    }))
    
    const categorizedUserTemplates = templates.map(template => ({
      ...template,
      category: getCategoryFromName(template.name),
      folder: getFolderFromName(template.name)
    }))

    setAllTemplates([...categorizedDefaults, ...categorizedUserTemplates])
  }, [templates])

  const getCategoryFromName = (name: string): string => {
    if (name.toLowerCase().includes('tomografia')) return 'tomografia'
    if (name.toLowerCase().includes('ressonância')) return 'ressonancia'
    if (name.toLowerCase().includes('raio')) return 'radiografia'
    if (name.toLowerCase().includes('ultrassom')) return 'ultrassom'
    return 'outros'
  }

  const getFolderFromName = (name: string): string => {
    if (name.toLowerCase().includes('protocolo')) return 'Protocolos'
    if (name.toLowerCase().includes('estruturado')) return 'Laudos Estruturados'
    if (name.toLowerCase().includes('normal')) return 'Padrões Normais'
    return 'Geral'
  }

  const categories = [
    { value: 'all', label: 'Todas Modalidades' },
    { value: 'tomografia', label: 'Tomografia' },
    { value: 'ressonancia', label: 'Ressonância' },
    { value: 'radiografia', label: 'Radiografia' },
    { value: 'ultrassom', label: 'Ultrassom' },
    { value: 'outros', label: 'Outros' }
  ]

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        parentId: selectedFolder || undefined
      }
      setFolders([...folders, newFolder])
      setNewFolderName('')
      setShowNewFolderDialog(false)
    }
  }

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setNewFolderName(folder.name)
    setShowNewFolderDialog(true)
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId))
    if (selectedFolder === folderId) {
      setSelectedFolder(null)
    }
  }

  const handleSaveFolder = () => {
    if (editingFolder && newFolderName.trim()) {
      setFolders(folders.map(f => 
        f.id === editingFolder.id 
          ? { ...f, name: newFolderName.trim() }
          : f
      ))
      setEditingFolder(null)
      setNewFolderName('')
      setShowNewFolderDialog(false)
    }
  }

  const handleCreateModel = () => {
    if (newModelName.trim() && newModelContent.trim()) {
      const newModel: Template = {
        id: `model-${Date.now()}`,
        name: newModelName.trim(),
        content: newModelContent.trim(),
        folder: selectedFolder || 'Geral'
      };
      setAllTemplates(prev => [...prev, newModel]);
      setNewModelName('');
      setNewModelContent('');
      setShowNewModelDialog(false);
    }
  };

  const handleTransferModel = (targetFolder: string) => {
    if (selectedModelForTransfer) {
      setAllTemplates(prev => prev.map(template => 
        template.id === selectedModelForTransfer.id 
          ? { ...template, folder: targetFolder }
          : template
      ));
      setSelectedModelForTransfer(null);
      setShowTransferDialog(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = 
        filterCategory === 'all' || template.category === filterCategory
      
      const matchesFolder = 
        !selectedFolder || template.folder === selectedFolder
      
      if (activeTab === 'todos') return matchesSearch && matchesCategory && matchesFolder
      if (activeTab === 'favoritos') return matchesSearch && matchesCategory && matchesFolder && modelosFavoritos.includes(template.id)
      return matchesSearch && matchesCategory && matchesFolder
    })
  }, [allTemplates, searchTerm, filterCategory, selectedFolder, activeTab, modelosFavoritos])

  const TemplateActions = ({ template }: { template: Template }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-white/10"
        onClick={() => onToggleFavorito(template.id)}
      >
        <Star
          className={cn(
            "h-4 w-4",
            modelosFavoritos.includes(template.id)
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-400"
          )}
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-white/10"
        onClick={() => onSelectModelo(template.content, template.name)}
      >
        <Plus className="h-4 w-4 text-gray-400" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-white/10"
        onClick={() => onTransferToQuick(template)}
      >
        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-white/10"
        onClick={() => {
          setSelectedModelForTransfer(template);
          setShowTransferDialog(true);
        }}
      >
        <FolderOpen className="h-4 w-4 text-gray-400" />
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex-none p-4 space-y-4 bg-dark-grey border-b border-border/10">
        <div className="flex items-center gap-4">
          <Select onValueChange={setFilterCategory} value={filterCategory}>
            <SelectTrigger className="w-[200px] bg-dark-grey border-gray-700 text-foreground">
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent className="bg-dark-grey border-gray-700">
              {categories.map((category) => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                  className="text-white hover:bg-white/5"
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Buscar modelos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-grey text-foreground placeholder-silver rounded-md border-gray-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors w-full"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-dark-grey border border-gray-700">
            <TabsTrigger 
              value="todos" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger 
              value="favoritos"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Star className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
          {/* Folders Panel */}
          <div className="lg:col-span-1 bg-dark-grey rounded-lg border border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Pastas</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingFolder(null);
                    setNewFolderName('');
                    setShowNewFolderDialog(true);
                  }}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  <FolderPlus className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNewModelName('');
                    setNewModelContent('');
                    setShowNewModelDialog(true);
                  }}
                  className="h-8 w-8 p-0 hover:bg-white/10"
                >
                  <FileText className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 pt-0 space-y-1">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between group"
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm px-2 h-8",
                        selectedFolder === folder.id ? "bg-primary/20 text-primary" : "text-gray-400"
                      )}
                      onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {folder.name}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/10"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-dark-grey border-gray-700">
                        <DropdownMenuItem
                          className="text-white hover:bg-white/10"
                          onClick={() => handleEditFolder(folder)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteFolder(folder.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Templates List */}
          <div className="lg:col-span-2 bg-dark-grey rounded-lg border border-gray-700 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center text-white/60 py-4">
                    Nenhum modelo de laudo encontrado.
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "group relative flex items-center justify-between p-3 rounded-lg transition-all border",
                        previewTemplate?.id === template.id
                          ? "bg-primary/20 border-primary/50"
                          : "bg-dark-grey border-gray-700 hover:border-primary/50"
                      )}
                    >
                      <div 
                        className="flex-1 min-w-0 mr-2 cursor-pointer"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <h3 className="text-sm text-white font-medium truncate">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.folder && (
                            <Badge variant="outline" className="text-xs">
                              {template.folder}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TemplateActions template={template} />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-dark-grey rounded-lg border border-gray-700 overflow-hidden">
            <AnimatePresence mode="wait">
              {previewTemplate ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-none p-2 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectModelo(previewTemplate.content, previewTemplate.name)}
                        className="h-8 text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Modelo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTransferToQuick(previewTemplate)}
                        className="h-8 text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Mover para Rápidos
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewTemplate(null)}
                      className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
                        {previewTemplate.content}
                      </pre>
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center text-white/40"
                >
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <p>Selecione um modelo para visualizar</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* New/Edit Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="bg-dark-grey border-gray-700">
          <DialogHeader>
            <DialogTitle>{editingFolder ? 'Renomear Pasta' : 'Nova Pasta'}</DialogTitle>
            <DialogDescription>
              {editingFolder ? 'Digite o novo nome da pasta' : 'Digite o nome da nova pasta'}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nome da pasta"
            className="bg-dark-grey border-gray-700 text-white"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewFolderDialog(false)
                setEditingFolder(null)
                setNewFolderName('')
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingFolder ? handleSaveFolder : handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              {editingFolder ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Model Dialog */}
      <Dialog open={showNewModelDialog} onOpenChange={setShowNewModelDialog}>
        <DialogContent className="bg-dark-grey border-gray-700">
          <DialogHeader>
            <DialogTitle>Novo Modelo</DialogTitle>
            <DialogDescription>
              Crie um novo modelo de laudo
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            placeholder="Nome do modelo"
            className="bg-dark-grey border-gray-700 text-white mb-4"
          />
          <Textarea
            value={newModelContent}
            onChange={(e) => setNewModelContent(e.target.value)}
            placeholder="Conteúdo do modelo"
            className="bg-dark-grey border-gray-700 text-white h-40"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewModelDialog(false);
                setNewModelName('');
                setNewModelContent('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateModel}
              disabled={!newModelName.trim() || !newModelContent.trim()}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Model Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="bg-dark-grey border-gray-700">
          <DialogHeader>
            <DialogTitle>Transferir Modelo</DialogTitle>
            <DialogDescription>
              Escolha a pasta para onde deseja transferir o modelo
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full pr-4">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                className="w-full justify-start text-left mb-2"
                onClick={() => handleTransferModel(folder.name)}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                {folder.name}
              </Button>
            ))}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTransferDialog(false);
                setSelectedModelForTransfer(null);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

