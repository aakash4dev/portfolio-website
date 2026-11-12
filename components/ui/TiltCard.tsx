"use client"

import { useRef, type ReactNode, type PointerEvent } from "react"
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion"

interface TiltCardProps { children: ReactNode; className?: string; glareColor?: string }

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useSpring(0, { stiffness: 150, damping: 24 })
  const y = useSpring(0, { stiffness: 150, damping: 24 })
  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3])

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!ref.current || reduceMotion || event.pointerType !== "mouse") return
    const box = ref.current.getBoundingClientRect()
    x.set((event.clientX - box.left) / box.width - 0.5)
    y.set((event.clientY - box.top) / box.height - 0.5)
  }

  return <motion.div ref={ref} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }} style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY }} className={`relative ${className}`}><div className="h-full w-full">{children}</div></motion.div>
}
