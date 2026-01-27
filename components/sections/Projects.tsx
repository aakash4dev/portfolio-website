"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowRight, Briefcase } from "lucide-react"
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
    description: "AI-powered medical assistant platform utilizing LLMs to provide health insights and preliminary diagnosis support.",
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
    title: "Airchains ZK-Sequencer (Tracks)",
    company: "Airchains",
    description:
      "Core contributor to 'Tracks' (ZK-Rollup stack), designing decentralized sequencing layers for secure verification and optimizing proof generation using Rust.",
    tags: ["Rust", "ZK-Rollup", "Sequencer", "Blockchain"],
  },
  {
    title: "Airchains Cross-Chain Bridge",
    company: "Airchains",
    description:
      "Architected a trustless bridge for assets between Cosmos and EVM chains. Implemented Stablecoin Issuance logic and secure cross-chain message passing (IBC).",
    tags: ["Solidity", "Cosmos", "Bridge", "IBC"],
  },
  {
    title: "Tarality ZK-EVM Prover",
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
]

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <TiltCard className="h-full rounded-xl overflow-hidden glass" glareColor="rgba(59, 130, 246, 0.2)">
        <div className="flex flex-col h-full">
          <div className="relative h-48 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <Image
              src={project.image}
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
  const isInView = useInView(ref, { once: true, amount: 0.3 })

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

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="projects" className="section-padding">
      {/* PERSONAL PROJECTS SECTION */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2">
            My <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />
          <motion.p variants={itemVariants} className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Personal tools, decentralized applications, and experiments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </motion.div>

      {/* CONTRIBUTIONS SECTION */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Professional <span className="gradient-text">Contributions</span></h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Key contributions to enterprise blockchain protocols and startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributions.map((contribution, index) => (
            <ContributionCard key={contribution.title} contribution={contribution} index={index} />
          ))}
        </div>
      </div>

    </section>
  )
}

