"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useClickOutside } from "@/hooks/use-click-outside"

const MorphingDialogContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

export function MorphingDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <MorphingDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </MorphingDialogContext.Provider>
  )
}

export function MorphingDialogTrigger({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(MorphingDialogContext)

  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  )
}

export function MorphingDialogContent({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(MorphingDialogContext)
  const ref = React.useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [setOpen])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <div
            className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-md"
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MorphingDialogTitle({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className="text-xl font-semibold mb-2 text-white" {...props}>
      {children}
    </h2>
  )
}

export function MorphingDialogDescription({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="text-sm text-gray-400 mb-4" {...props}>
      {children}
    </p>
  )
}

export function MorphingDialogClose({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(MorphingDialogContext)

  return (
    <div onClick={() => setOpen(false)} {...props}>
      {children}
    </div>
  )
}

