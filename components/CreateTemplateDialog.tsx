'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (template: {
    titulo: string
    categoria: string
    conteudo: string
    tags: string[]
  }) => void
}

export function CreateTemplateDialog({ isOpen, onClose, onSave }: CreateTemplateDialogProps) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      titulo,
      categoria,
      conteudo,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2C2C2C] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar Novo Modelo de Laudo</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informações abaixo para criar um novo modelo de laudo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Modelo</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="bg-[#0A0A0A] border-[#2C2C2C] text-white"
              placeholder="Ex: TC Crânio Normal"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria} required>
              <SelectTrigger className="bg-[#0A0A0A] border-[#2C2C2C] text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#2C2C2C]">
                <SelectItem value="radiografia">Radiografia</SelectItem>
                <SelectItem value="tomografia">Tomografia</SelectItem>
                <SelectItem value="ressonancia">Ressonância</SelectItem>
                <SelectItem value="ultrassom">Ultrassom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="conteudo">Conteúdo do Modelo</Label>
            <Textarea
              id="conteudo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="min-h-[200px] bg-[#0A0A0A] border-[#2C2C2C] text-white"
              placeholder="TÉCNICA:&#10;&#10;ANÁLISE:&#10;&#10;IMPRESSÃO:"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-[#0A0A0A] border-[#2C2C2C] text-white"
              placeholder="Ex: normal, rotina, neurologia"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent hover:bg-[#2C2C2C] text-white border-[#2C2C2C] rounded-md"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-white hover:bg-gray-200 text-black rounded-md"
            >
              Salvar Modelo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

