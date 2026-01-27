"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="about" className="section-padding">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* Image */}
        <motion.div variants={itemVariants} className="order-2 md:order-1">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden glow-border">
            <div className="absolute inset-0 z-10" />
            <Image src="/me_coding.png?height=800&width=600" alt="Aakash" fill className="object-cover" priority />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="order-1 md:order-2">
          <h2 className="text-3xl font-bold mb-2">
            About <span className="gradient-text">Me</span>
          </h2>

          <div className="h-1 w-20 bg-primary mb-6 rounded-full" />

          <p className="text-lg mb-6">
            Senior Blockchain Engineer with 4+ years of experience specializing in Smart Contract Development (Solidity/Rust) and DeFi Architecture. Expert in building Layer-1 chains (Cosmos-SDK), Stablecoin Issuance protocols, and designing ZK Sequencers & Provers for high-scale networks.
          </p>

          <p className="text-lg mb-6">
            Currently pursuing M.Tech in AI at BITS Pilani. My tech stack includes <span className="text-primary font-mono">Solidity</span>,
            <span className="text-green-500 font-mono"> Rust</span>,
            <span className="text-yellow-500 font-mono"> Golang</span>,
            <span className="text-blue-500 font-mono"> Python</span>, and
            <span className="text-blue-400 font-mono"> TypeScript</span>.
          </p>

          <div className="flex space-x-4 mb-8">
            <a
              href="https://github.com/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-sky-500 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          <Button size="lg" className="group">
            View Portfolio
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

