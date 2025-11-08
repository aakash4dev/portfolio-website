"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Personal projects from aakash4dev GitHub
const projects = [
  {
    title: "ZKRollup - Zero-Knowledge Rollups",
    description:
      "A Solidity contract implementing Zero-Knowledge Rollups for enhanced scalability and privacy on Ethereum. Reduces gas costs while maintaining security through cryptographic proofs.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "Zero-Knowledge", "Rollups", "Ethereum", "Scalability"],
    category: "ZK",
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "SmartZK - Zero-Knowledge Smart Contracts",
    description:
      "Smart contracts leveraging Zero-Knowledge proofs for secure and private transactions. Enables privacy-preserving blockchain applications with address validation and secure value transfers.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "Zero-Knowledge", "Privacy", "Smart Contracts", "ZK-Proofs"],
    category: "ZK",
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "UpdatableNFT - Dynamic NFT Contract",
    description:
      "An ERC721 contract allowing dynamic updates to NFT metadata, providing flexibility in NFT applications and enabling evolving digital assets with on-chain metadata management.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "ERC721", "NFT", "Ethereum", "Metadata"],
    category: "NFT",
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "LevelDB CRUD Operations in Go",
    description:
      "A Go-based implementation demonstrating Create, Read, Update, and Delete operations using LevelDB, a fast key-value storage library. Showcases efficient data persistence patterns for backend systems.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Go", "LevelDB", "Database", "Backend", "CRUD"],
    category: "Backend",
    github: "https://github.com/aakash4dev",
    demo: "https://github.com/aakash4dev",
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

