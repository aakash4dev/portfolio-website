"use client"

import { motion, useScroll, useSpring } from "framer-motion"

// Thin red bar at the top of the window that shows how far the page is scrolled.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })
  return <motion.div className="press-scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
