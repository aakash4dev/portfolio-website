"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Define colors directly with RGB values
    const planetColors = {
      blue: { r: 59, g: 130, b: 246 },
      green: { r: 16, g: 185, b: 129 },
      red: { r: 244, g: 63, b: 94 },
      purple: { r: 139, g: 92, b: 246 },
      orange: { r: 245, g: 158, b: 11 },
    }

    // Planet class
    class Planet {
      x: number
      y: number
      radius: number
      color: { r: number; g: number; b: number }
      alpha: number
      orbitRadius: number
      orbitSpeed: number
      angle: number
      glowIntensity: number
      glowDirection: number
      centerX: number
      centerY: number

      constructor(
        centerX: number,
        centerY: number,
        orbitRadius: number,
        radius: number,
        color: { r: number; g: number; b: number },
        alpha: number,
        orbitSpeed: number,
      ) {
        this.centerX = centerX
        this.centerY = centerY
        this.orbitRadius = orbitRadius
        this.radius = radius
        this.color = color
        this.alpha = alpha
        this.orbitSpeed = orbitSpeed
        this.angle = Math.random() * Math.PI * 2
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius
        this.glowIntensity = 0.5
        this.glowDirection = Math.random() > 0.5 ? 0.005 : -0.005
      }

      update() {
        this.angle += this.orbitSpeed
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius

        // Pulsating glow effect
        this.glowIntensity += this.glowDirection
        if (this.glowIntensity > 0.8 || this.glowIntensity < 0.3) {
          this.glowDirection *= -1
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const { r, g, b } = this.color

        // Create gradient with proper rgba values
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2)

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.alpha})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.glowIntensity * this.alpha})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        // Draw the planet
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`
        ctx.fill()

        // Draw the glow
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Star class for background
    class Star {
      x: number
      y: number
      size: number
      opacity: number
      opacityChange: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.8 + 0.2
        this.opacityChange = Math.random() * 0.01 + 0.005
      }

      update() {
        this.opacity += this.opacityChange
        if (this.opacity > 1 || this.opacity < 0.2) {
          this.opacityChange *= -1
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
      }
    }

    // Position the animation in the top-right corner
    const cornerX = canvas.width * 0.85
    const cornerY = canvas.height * 0.25

    // Create planets with direct RGB values - positioned in the corner
    const planets = [
      // Center sun/main orb in the corner
      new Planet(cornerX, cornerY, 0, 30, planetColors.blue, 0.8, 0),
      // Orbiting planets
      new Planet(cornerX, cornerY, 60, 8, planetColors.green, 0.7, 0.005),
      new Planet(cornerX, cornerY, 100, 12, planetColors.red, 0.7, 0.003),
      new Planet(cornerX, cornerY, 140, 10, planetColors.purple, 0.7, 0.002),
      new Planet(cornerX, cornerY, 180, 6, planetColors.orange, 0.7, 0.004),
    ]

    // Create stars
    const stars: Star[] = []
    for (let i = 0; i < 100; i++) {
      stars.push(new Star())
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Update corner position on resize
      const newCornerX = canvas.width * 0.85
      const newCornerY = canvas.height * 0.25

      // Update planet positions
      planets[0].centerX = newCornerX
      planets[0].centerY = newCornerY

      planets.forEach((planet) => {
        planet.centerX = newCornerX
        planet.centerY = newCornerY
      })
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        star.update()
        star.draw(ctx)
      })

      // Draw orbit paths with reduced opacity
      planets.slice(1).forEach((planet) => {
        ctx.beginPath()
        ctx.arc(planet.centerX, planet.centerY, planet.orbitRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
        ctx.stroke()
      })

      // Update and draw planets
      planets.forEach((planet) => {
        planet.update()
        planet.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas for 2D animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Content */}
      <div className="z-10 text-center px-4 md:px-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 glow-text">
            Hi, I'm <span className="gradient-text">Aakash</span>
          </h1>

          <h2 className="text-xl md:text-2xl mb-6 font-bold text-white">
            Blockchain <span className="text-primary">×</span> AI Developer
          </h2>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Building futuristic digital tools and infrastructure with
            <span className="text-primary font-mono"> Solidity</span>,
            <span className="text-green-500 font-mono"> Rust</span>, and
            <span className="text-purple-500 font-mono"> AI</span>.
          </p>

          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={scrollToAbout}>
              Explore My Work
              <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm mb-2 text-muted-foreground">Scroll Down</p>
          <ArrowDown className="h-5 w-5 text-primary" />
        </motion.div>
      </div>
    </section>
  )
}

