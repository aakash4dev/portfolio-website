"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Sample projects data - expanded with more projects
const projects = [
  {
    title: "DeFi Exchange Platform",
    description:
      "A decentralized exchange platform built on Ethereum with automated market making and liquidity pools.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "React", "Web3.js", "Ethereum"],
    category: "DeFi",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "AI-Powered NFT Generator",
    description:
      "An application that uses AI to generate unique NFT artwork based on text prompts and mints them on the blockchain.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Python", "TensorFlow", "Solidity", "IPFS"],
    category: "NFT",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "Smart Contract Auditing Tool",
    description: "An automated tool that scans Solidity smart contracts for vulnerabilities and security issues.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Rust", "Solidity", "Security", "Blockchain"],
    category: "Security",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "Cross-Chain Bridge",
    description:
      "A bridge that enables asset transfers between different blockchain networks with security and efficiency.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Go", "Solidity", "Blockchain", "Web3"],
    category: "Infrastructure",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "DAO Governance Platform",
    description:
      "A decentralized autonomous organization platform with proposal creation, voting, and treasury management.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "React", "The Graph", "Ethereum"],
    category: "DAO",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "Blockchain Analytics Dashboard",
    description:
      "A comprehensive analytics dashboard for monitoring blockchain networks, transactions, and smart contracts.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["TypeScript", "D3.js", "Node.js", "GraphQL"],
    category: "Analytics",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "Decentralized Identity Solution",
    description: "A self-sovereign identity system using blockchain for secure and private identity verification.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Rust", "IPFS", "Zero-Knowledge Proofs", "Ethereum"],
    category: "Identity",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
  {
    title: "AI Trading Bot",
    description:
      "An automated trading bot that uses machine learning to analyze market data and execute trades on DEXs.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Python", "TensorFlow", "Web3.py", "DeFi"],
    category: "AI",
    github: "https://github.com/aakash4dev",
    demo: "https://aakash4dev.com",
  },
]

function ProjectCard({ project }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl overflow-hidden h-full flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
          {project.category}
        </div>
      </div>

      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>

        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto flex gap-4">
        <Button variant="outline" size="sm" asChild>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <Github className="h-4 w-4 mr-2" />
            Code
          </a>
        </Button>

        <Button size="sm" asChild>
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Demo
          </a>
        </Button>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter projects based on search query only
  const filteredProjects = projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">My Projects</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore my portfolio of blockchain and AI projects, from DeFi applications to smart contract tools.
        </p>
      </div>

      {/* Search Only - No Filters */}
      <div className="mb-10 flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No projects found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </main>
  )
}

