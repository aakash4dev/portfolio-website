"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowRight } from "lucide-react"

const projects = [
  {
    title: "ZKRollup - Zero-Knowledge Rollups",
    description:
      "A Solidity contract implementing Zero-Knowledge Rollups for enhanced scalability and privacy on Ethereum. Reduces gas costs while maintaining security through cryptographic proofs.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "Zero-Knowledge", "Rollups", "Ethereum"],
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "SmartZK - Zero-Knowledge Smart Contracts",
    description:
      "Smart contracts leveraging Zero-Knowledge proofs for secure and private transactions. Enables privacy-preserving blockchain applications with address validation and secure value transfers.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "Zero-Knowledge", "Privacy", "Smart Contracts"],
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "UpdatableNFT - Dynamic NFT Contract",
    description:
      "An ERC721 contract allowing dynamic updates to NFT metadata, providing flexibility in NFT applications and enabling evolving digital assets with on-chain metadata management.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Solidity", "ERC721", "NFT", "Ethereum"],
    github: "https://gist.github.com/aakash4dev",
    demo: "https://gist.github.com/aakash4dev",
  },
  {
    title: "LevelDB CRUD Operations in Go",
    description:
      "A Go-based implementation demonstrating Create, Read, Update, and Delete operations using LevelDB, a fast key-value storage library. Showcases efficient data persistence patterns.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Go", "LevelDB", "Database", "Backend"],
    github: "https://github.com/aakash4dev",
    demo: "https://github.com/aakash4dev",
  },
]

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo: string
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
      </div>

      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>

        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string) => (
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

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

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

  // Display all 4 projects
  const displayedProjects = projects.slice(0, 4)

  return (
    <section id="projects" className="section-padding">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2">
          My <span className="gradient-text">Projects</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />

        <motion.p variants={itemVariants} className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Here are some of my personal projects in blockchain development, smart contracts, and backend systems.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {displayedProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      {/* All Projects Button */}
      <div className="flex justify-center">
        <Button size="lg" asChild className="group">
          <Link href="/projects">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

