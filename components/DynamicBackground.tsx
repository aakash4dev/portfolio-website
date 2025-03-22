"use client"

import { useEffect, useRef } from "react"

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const mousePosition = { x: 0, y: 0 }
    const mouseRadius = 100

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX
      mousePosition.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Define Particle class
    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      opacityDirection: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 2 + 0.5
        this.size = this.baseSize
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.5 + 0.2
        this.opacityDirection = Math.random() > 0.5 ? 0.003 : -0.003

        // Color palette that matches the site theme
        const colors = [
          "rgba(59, 130, 246, 0.6)", // blue
          "rgba(139, 92, 246, 0.6)", // purple
          "rgba(16, 185, 129, 0.6)", // green
          "rgba(245, 158, 11, 0.6)", // amber
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }

        // Pulsate opacity
        this.opacity += this.opacityDirection
        if (this.opacity > 0.7 || this.opacity < 0.2) {
          this.opacityDirection = -this.opacityDirection
        }

        // Interactive effect with mouse
        const dx = mousePosition.x - this.x
        const dy = mousePosition.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRadius) {
          // Increase size when mouse is near
          const scale = 1 + (mouseRadius - distance) / mouseRadius
          this.size = this.baseSize * Math.min(scale, 3)

          // Move away from mouse
          const angle = Math.atan2(dy, dx)
          const force = ((mouseRadius - distance) / mouseRadius) * 0.5
          this.x -= Math.cos(angle) * force
          this.y -= Math.sin(angle) * force
        } else {
          // Return to base size
          this.size = this.baseSize
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

        // Extract the RGB values from the rgba string
        const colorMatch = this.color.match(/rgba$$(\d+),\s*(\d+),\s*(\d+),\s*[\d.]+$$/)
        if (colorMatch) {
          const r = Number.parseInt(colorMatch[1])
          const g = Number.parseInt(colorMatch[2])
          const b = Number.parseInt(colorMatch[3])
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`
        } else {
          ctx.fillStyle = this.color
        }

        ctx.fill()
      }
    }

    // Connect particles with lines
    function connectParticles() {
      if (!ctx) return

      const maxDistance = 150
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            const color = `rgba(59, 130, 246, ${opacity * 0.15})`

            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles
    function initParticles() {
      particles = []
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.03), 80)

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60" />
}

