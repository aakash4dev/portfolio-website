"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Search, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import TiltCard from "@/components/ui/TiltCard"

// Data for Personal Projects
const personalProjects = [
  {
    title: "TheDevKits.com",
    description: "A comprehensive toolkit for developers, providing resources, templates, and utilities to streamline development workflows.",
    image: "/projects/thedevkits.png",
    tags: ["Next.js", "React", "TailwindCSS", "Tools"],
    github: "",
    demo: "https://thedevkits.com",
  },
  {
    title: "Medisence AI",
    description: "AI-powered medical assistant platform utilizing LLMs to provide health insights and preliminary diagnosis support. (recognised by commudle)",
    image: "/projects/medisence.png",
    tags: ["AI", "LLM", "Python", "Healthcare"],
    github: "https://github.com/aakash4dev/medisence-ai",
    demo: "",
  },
  {
    title: "VRF Chain",
    description: "Verifiable Random Function (VRF) implementation on blockchain for secure and provably fair on-chain randomness.",
    image: "/projects/vrfchain.png",
    tags: ["Blockchain", "VRF", "Cryptography", "Solidity"],
    github: "https://github.com/aakash4dev/vrfchain",
    demo: "",
  },
  {
    title: "MarketCompassZ",
    description: "Market analysis tool providing insights and trends visualization for crypto and financial markets.",
    image: "/projects/marketcompassz.png",
    tags: ["Finance", "Data Viz", "API", "React"],
    github: "https://github.com/aakash4dev/MarketCompassZ",
    demo: "",
  },
  {
    title: "Next.js Ethereum Explorer",
    description: "A lightweight block explorer for Ethereum networks built with Next.js, allowing users to query blocks, transactions, and addresses.",
    image: "/projects/explorer.png",
    tags: ["Next.js", "Ethers.js", "Blockchain", "Explorer"],
    github: "https://github.com/aakash4dev/nextjs-ethereum-explorer",
    demo: "https://nextjs-ethereum-explorer.vercel.app/",
  },
]

// Data for Professional Contributions
const contributions = [
  {
    title: "ZK-EVM Prover",
    company: "Tarality",
    description:
      "Implemented a ZK-Prover for EVM-compatibility, focusing on verifying state transitions without revealing user data, enabling privacy-preserving smart contract execution.",
    tags: ["Go", "ZK-EVM", "Privacy", "Cryptography"],
  },
  {
    title: "Nowa Swap (L2 DEX)",
    company: "Tarality",
    description:
      "Contributed to the backend and smart contract architecture of the DeFi Swap platform on ZK-EVM. Integrated custom liquidity pools for stablecoin pairs to minimize slippage.",
    tags: ["Solidity", "DeFi", "DEX", "AMM"],
  },
  {
    title: "ZK-Sequencer (Tracks)",
    company: "Airchains",
    description:
      "Core contributor to 'Tracks' (ZK-Rollup stack), designing decentralized sequencing layers for secure verification and optimizing proof generation using Rust.",
    tags: ["Rust", "ZK-Rollup", "Sequencer", "Blockchain"],
  },
  {
    title: "Junction (Blockchain)",
    company: "Airchains",
    description:
      "Developed the core Junction blockchain (Cosmos SDK-based) acting as the verification layer for ZK-Rollups, implementing custom switching modules and validator set logic.",
    tags: ["Go", "Cosmos SDK", "Tendermint", "L1"],
  },
  {
    title: "Cross-Chain Bridge",
    company: "Airchains",
    description:
      "Architected a trustless bridge for assets between Cosmos and EVM chains. Implemented Stablecoin Issuance logic and secure cross-chain message passing (IBC).",
    tags: ["Solidity", "Cosmos", "Bridge", "IBC"],
  },
  {
    title: "Blockchain Explorer",
    company: "Retcons",
    description:
      "Built a high-performance block explorer from scratch, featuring real-time transaction tracking, visual block propagation graphs, and detailed address analytics.",
    tags: ["Next.js", "WebSockets", "Data Indexing"],
  },
  {
    title: "Smart Contract Builder",
    company: "Retcons",
    description:
      "Created a no-code Solidity smart contract builder allowing users to generate secure ERC-20 and NFT contracts via a drag-and-drop interface.",
    tags: ["Solidity", "Code Gen", "React", "Tools"],
  },
]

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <TiltCard className="h-full rounded-xl overflow-hidden glass" glareColor="rgba(59, 130, 246, 0.2)">
        <div className="flex flex-col h-full">
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
            <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 pt-0 mt-auto flex gap-4">
            {project.github && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </a>
              </Button>
            )}

            {project.demo && (
              <Button size="sm" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live / Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

function ContributionCard({ contribution, index }: { contribution: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full p-6 rounded-xl glass border border-white/5 hover:border-primary/30 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{contribution.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Briefcase className="w-3 h-3" />
              <span>{contribution.company}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground/80 mb-4 leading-relaxed">
          {contribution.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {contribution.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filterItem = (item: any) => {
    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
      (item.company && item.company.toLowerCase().includes(query))
    )
  }

  const filteredPersonal = personalProjects.filter(filterItem)
  const filteredContributions = contributions.filter(filterItem)

  const hasResults = filteredPersonal.length > 0 || filteredContributions.length > 0

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">My Projects</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore my portfolio of blockchain protocols, dApps, and contribution to enterprise systems.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-16 flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects, technologies, or companies..."
            className="pl-10 glass border-border/40 focus:border-primary/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {hasResults ? (
        <div className="space-y-20">
          {/* Personal Projects Section */}
          {filteredPersonal.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Personal Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPersonal.map((project, index) => (
                  <ProjectCard key={project.title} project={project} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Contributions Section */}
          {filteredContributions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Professional Contributions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContributions.map((contribution, index) => (
                  <ContributionCard key={contribution.title} contribution={contribution} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-xl">
          <p className="text-xl text-muted-foreground">No projects found matching "{searchQuery}".</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </main>
  )
}
