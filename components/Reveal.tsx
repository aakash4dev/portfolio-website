"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface RevealProps {
  children: ReactNode
  className?: string
  id?: string
  /** Seconds to wait before the animation starts. Use it to show items one after another. */
  delay?: number
  as?: "div" | "article" | "section" | "li" | "span"
  from?: "bottom" | "left" | "right" | "none"
}

const offsets = { bottom: { y: 30 }, left: { x: -36 }, right: { x: 36 }, none: {} }

// Fades content in and slides it into place the first time it scrolls into view.
export default function Reveal({ children, className, id, delay = 0, as = "div", from = "bottom" }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, ...offsets[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -70px 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  )
}
