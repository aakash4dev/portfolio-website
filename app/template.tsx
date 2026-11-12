"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

// Runs on every page change: the new page fades in and moves up a little.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}
