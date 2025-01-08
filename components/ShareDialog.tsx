import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from 'lucide-react'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  report: string
}

export function ShareDialog({ isOpen, onClose, report }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleCopy = () => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    // Implement sharing logic here (e.g., send email with report)
    console.log('Sharing report with:', recipientEmail, message)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] text-white border-[#2E2E2E]">
        <DialogHeader>
          <DialogTitle>Compartilhar Relatório</DialogTitle>
          <DialogDescription>
            Compartilhe este relatório com colegas para colaboração e segunda opinião.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Email do Destinatário</Label>
            <Input
              id="recipient"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="bg-[#2E2E2E] border-[#3E3E3E] text-white"
            />
          </div>
          <div>
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-[#2E2E2E] border-[#3E3E3E] text-white"
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={handleCopy} variant="outline" className="bg-[#2E2E2E] text-white border-[#3E3E3E]">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copiado!' : 'Copiar Relatório'}
            </Button>
            <Button onClick={handleShare} className="bg-emerald-600 text-white hover:bg-emerald-700">
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

