"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

export default function SuperhumanRadiology() {
  const controls = useAnimation()
  const textRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const animateGlow = async () => {
      await controls.start({ 
        opacity: [0.95, 1, 0.95], 
        filter: ['brightness(1)', 'brightness(1.03)', 'brightness(1)'],
        transition: { 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        } 
      })
    }
    animateGlow()
  }, [controls])

  return (
    <div 
      className="w-full h-[100px] bg-gradient-to-r from-[#0f0f0f] via-[#141414] to-[#0f0f0f] flex items-center justify-between overflow-hidden px-6 sm:px-10"
      style={{ boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient id="silver-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B0B0B0">
              <animate attributeName="stop-color" values="#B0B0B0;#D0D0D0;#B0B0B0" dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#C0C0C0">
              <animate attributeName="stop-color" values="#C0C0C0;#E0E0E0;#C0C0C0" dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#B0B0B0">
              <animate attributeName="stop-color" values="#B0B0B0;#D0D0D0;#B0B0B0" dur="8s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
      </svg>
      
      <motion.div 
        className="flex-shrink-0 w-10 sm:w-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="pulseGradient">
              <stop offset="10%" stopColor="#7CFFD4"/>
              <stop offset="95%" stopColor="#7CFFD400"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <mask id="logo-clip">
              <path d="M25 25H45V75H25V25ZM45 75H75V85H45V75Z" fill="white"/>
            </mask>
          </defs>
          <style>
            {`.logoPath {
              offset-path: path('M25 25H45V75H25V25ZM45 75H75V85H45V75Z');
              animation: followpath 15s linear infinite, pulse 7s ease-in-out infinite;
              opacity: 0;
            }
            @keyframes followpath {
              to {
                offset-distance: 100%;
              }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0; r: 1; }
              50% { opacity: 0.5; r: 2.5; }
            }`}
          </style>
          <rect width="100" height="100" fill="#0f0f0f"/>
          <motion.path 
            d="M25 25H45V75H25V25ZM45 75H75V85H45V75Z" 
            fill="#E8E8E8" 
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <g mask="url(#logo-clip)">
            <circle fill="url(#pulseGradient)" className="logoPath"/>
          </g>
        </svg>
      </motion.div>

      <motion.div
        ref={textRef}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative flex-grow text-right"
      >
        <motion.div
          animate={controls}
          className="absolute inset-0"
          style={{
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            fontSize: "14.5px",
            letterSpacing: "3.8px",
            fontWeight: 400,
            color: "#D0D0D0",
            textShadow: "0 0 2px rgba(208, 208, 208, 0.2)",
          }}
        >
          NEXT-GEN RADIOLOGY REPORTING
        </motion.div>
        <div
          className="mix-blend-overlay"
          style={{
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            fontSize: "14.5px",
            letterSpacing: "3.8px",
            fontWeight: 400,
            background: "url(#silver-shimmer)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          NEXT-GEN RADIOLOGY REPORTING
        </div>
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-20 sm:left-24 text-[#7CFFD4] text-xs"
          >
            LAUDA
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

