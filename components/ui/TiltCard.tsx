"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    glareColor?: string
}

export default function TiltCard({ children, className = "", glareColor = "rgba(255, 255, 255, 0.1)" }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    // Mouse position state
    const x = useSpring(0, { stiffness: 150, damping: 20 })
    const y = useSpring(0, { stiffness: 150, damping: 20 })

    // Transform to rotation
    const rotateX = useTransform(y, [-0.5, 0.5], [15, -15])
    const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15])

    // Glare position
    const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
    const glareY = useTransform(y, [-0.5, 0.5], [0, 100])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Normalize mouse position between -0.5 and 0.5
        const xPct = (mouseX / width) - 0.5
        const yPct = (mouseY / height) - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative transform-gpu ${className}`}
        >
            <div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                }}
                className="h-full w-full"
            >
                {children}
            </div>

            {/* Glare Effect */}
            {isHovered && (
                <motion.div
                    style={{
                        background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 80%)`,
                        opacity: 0.4,
                        pointerEvents: "none",
                        transform: "translateZ(75px)",
                    }}
                    className="absolute inset-0 rounded-xl z-20 mix-blend-overlay"
                />
            )}
        </motion.div>
    )
}
