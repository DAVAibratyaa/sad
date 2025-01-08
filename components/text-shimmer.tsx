"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface TextShimmerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: string
  as?: keyof JSX.IntrinsicElements
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  as = "p",
  duration = 2,
  spread = 2,
  ...props
}: TextShimmerProps) {
  const Component = as
  const contentLength = children.length

  return (
    <Component
      {...props}
      style={{
        ...props.style,
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      <motion.span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          )`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: duration * (contentLength / 10),
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children}
    </Component>
  )
}

