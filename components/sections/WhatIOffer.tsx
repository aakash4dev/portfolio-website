"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Code, Database, Cpu, Server, Layers, Zap, LineChart } from "lucide-react"

const services = [
  {
    title: "AI Blockchain Consultant",
    description:
      "Strategic guidance on integrating AI with blockchain technologies for innovative solutions and competitive advantage.",
    icon: <Brain className="h-10 w-10 text-primary" />,
  },
  {
    title: "Smart Contract Development",
    description:
      "Secure, efficient, and audited smart contracts for DeFi, NFTs, DAOs, and custom blockchain applications.",
    icon: <Code className="h-10 w-10 text-green-500" />,
  },
  {
    title: "DApp Architecture",
    description:
      "End-to-end decentralized application design and development with scalable and user-friendly interfaces.",
    icon: <Layers className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "AI Integration Services",
    description:
      "Implementing machine learning models and AI algorithms to enhance blockchain applications and data analysis.",
    icon: <Cpu className="h-10 w-10 text-red-500" />,
  },
  {
    title: "Blockchain Infrastructure",
    description:
      "Setting up and maintaining nodes, networks, and infrastructure for blockchain projects and enterprises.",
    icon: <Server className="h-10 w-10 text-yellow-500" />,
  },
  {
    title: "Tokenomics Design",
    description:
      "Strategic token economic models to ensure sustainable growth and value creation for blockchain projects.",
    icon: <LineChart className="h-10 w-10 text-blue-400" />,
  },
  {
    title: "Technical Due Diligence",
    description:
      "Comprehensive assessment of blockchain projects, smart contracts, and technical infrastructure for investors.",
    icon: <Database className="h-10 w-10 text-indigo-500" />,
  },
  {
    title: "Web3 Training & Workshops",
    description:
      "Customized training programs and workshops on blockchain development, AI integration, and emerging technologies.",
    icon: <Zap className="h-10 w-10 text-orange-500" />,
  },
]

export default function WhatIOffer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="services" className="section-padding py-20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2">
          What I <span className="gradient-text">Offer</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />

        <motion.p variants={itemVariants} className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Specialized services combining blockchain technology and artificial intelligence to create innovative
          solutions.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div key={service.title} variants={itemVariants} custom={index} className="h-full">
            <Card className="h-full glass border-border/30 hover:border-primary/50 transition-colors duration-300">
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <div className="mb-4 p-3 rounded-full bg-background/50">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>{service.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

