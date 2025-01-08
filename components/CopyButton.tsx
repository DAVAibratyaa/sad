import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="bg-[#2C2C2C] text-[#EDEDED] border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white transition-colors duration-200 rounded-lg"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copiar Laudo
        </>
      )}
    </Button>
  )
}

