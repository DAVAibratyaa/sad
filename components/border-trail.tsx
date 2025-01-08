"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface BorderTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: number
  duration?: number
}

export function BorderTrail({
  children,
  size = 60,
  duration = 2,
  ...props
}: BorderTrailProps) {
  return (
    <div className="relative" {...props}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)`,
        }}
        animate={{
          pathLength: [0, 1, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-[#1A1A1A] rounded-xl p-[2px]">
        {children}
      </div>
    </div>
  )
}

