"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Youtube, BookOpen, FileText, Star } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Sample tutorial data
const youtubeVideos = [
  {
    id: "yt1",
    title: "Building a DeFi Application from Scratch",
    description: "Learn how to create a complete decentralized finance application using Solidity and React.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "March 10, 2023",
    tags: ["DeFi", "Solidity", "React"],
  },
  {
    id: "yt2",
    title: "Smart Contract Security Best Practices",
    description: "Discover the essential security patterns to protect your smart contracts from vulnerabilities.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "February 15, 2023",
    tags: ["Security", "Smart Contracts", "Auditing"],
  },
  {
    id: "yt3",
    title: "Integrating AI with Blockchain",
    description: "A step-by-step guide to combining machine learning models with blockchain applications.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "January 22, 2023",
    tags: ["AI", "ML", "Blockchain"],
  },
  {
    id: "yt4",
    title: "Creating NFT Marketplaces",
    description: "How to build your own NFT marketplace with metadata handling and auction functionality.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "December 5, 2022",
    tags: ["NFT", "Marketplace", "ERC-721"],
  },
  {
    id: "yt5",
    title: "Web3 Authentication Methods",
    description:
      "Explore different authentication methods for Web3 applications including wallet connect and sign-in with Ethereum.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "November 18, 2022",
    tags: ["Web3", "Authentication", "Security"],
  },
  {
    id: "yt6",
    title: "Building a DAO from Scratch",
    description:
      "Learn how to create a Decentralized Autonomous Organization with voting mechanisms and treasury management.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "October 22, 2022",
    tags: ["DAO", "Governance", "Solidity"],
  },
  {
    id: "yt7",
    title: "Zero-Knowledge Proofs in Blockchain",
    description: "Understanding how to implement and use zero-knowledge proofs for privacy in blockchain applications.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "September 15, 2022",
    tags: ["ZK-Proofs", "Privacy", "Cryptography"],
  },
  {
    id: "yt8",
    title: "Layer 2 Scaling Solutions",
    description:
      "Comparing different Layer 2 scaling solutions for Ethereum including Optimistic Rollups and ZK-Rollups.",
    embedId: "dQw4w9WgXcQ", // Example YouTube video ID
    date: "August 10, 2022",
    tags: ["Layer 2", "Scaling", "Ethereum"],
  },
]

const udemyCourses = [
  {
    id: "udemy1",
    title: "Complete Blockchain Developer Bootcamp",
    description: "Comprehensive course covering blockchain fundamentals, Solidity, Web3.js, and dApp development.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "32 hours",
    students: "15,420",
    rating: 4.8,
    url: "https://udemy.com/course/example1",
    price: "$89.99",
  },
  {
    id: "udemy2",
    title: "Advanced Smart Contract Development",
    description: "Master complex smart contract patterns, gas optimization, and security for enterprise applications.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "28 hours",
    students: "8,750",
    rating: 4.7,
    url: "https://udemy.com/course/example2",
    price: "$94.99",
  },
  {
    id: "udemy3",
    title: "AI for Blockchain Developers",
    description:
      "Learn how to integrate machine learning models with blockchain applications for enhanced functionality.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "24 hours",
    students: "6,320",
    rating: 4.6,
    url: "https://udemy.com/course/example3",
    price: "$79.99",
  },
  {
    id: "udemy4",
    title: "Rust Programming for Blockchain",
    description: "Master Rust programming language for high-performance blockchain development and smart contracts.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    duration: "30 hours",
    students: "5,180",
    rating: 4.9,
    url: "https://udemy.com/course/example4",
    price: "$99.99",
  },
]

const otherResources = [
  {
    id: "resource1",
    title: "Blockchain Development Guide",
    description: "A comprehensive guide covering all aspects of blockchain development from basics to advanced topics.",
    type: "Documentation",
  },
  {
    id: "resource2",
    title: "Smart Contract Security Checklist",
    description: "A detailed checklist for auditing smart contracts and identifying common vulnerabilities.",
    type: "Guide",
  },
  {
    id: "resource3",
    title: "Web3 Developer Roadmap",
    description: "A structured learning path for becoming a proficient Web3 and blockchain developer.",
    type: "Reference",
  },
  {
    id: "resource4",
    title: "Tokenomics Design Patterns",
    description: "Learn about effective token economic models and how to implement them in your projects.",
    type: "Whitepaper",
  },
  {
    id: "resource5",
    title: "Solidity Best Practices",
    description: "Comprehensive documentation on writing secure and efficient Solidity smart contracts.",
    type: "Documentation",
  },
  {
    id: "resource6",
    title: "Zero-Knowledge Proofs Explained",
    description: "Technical explanation of zero-knowledge proof systems and their blockchain applications.",
    type: "Reference",
  },
]

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState("youtube")

  const tabItems = [
    { id: "youtube", label: "YouTube Videos", icon: <Youtube className="h-5 w-5" /> },
    { id: "udemy", label: "Udemy Courses", icon: <BookOpen className="h-5 w-5" /> },
    { id: "other", label: "Docs", icon: <FileText className="h-5 w-5" /> },
  ]

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Tutorials</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Educational resources to help you master blockchain development, AI integration, and Web3 technologies.
        </p>
      </div>

      {/* Modern Tab Navigation */}
      <div className="mb-12">
        <div className="flex justify-center mb-2">
          <div className="glass rounded-full p-1 flex">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center space-x-2">
                  {tab.icon}
                  <span className="relative hidden md:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground md:hidden">
          {tabItems.find((tab) => tab.id === activeTab)?.label}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* YouTube Videos - Responsive Grid Layout */}
          {activeTab === "youtube" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="glass border-border/30 rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                  </div>

                  <div className="aspect-video w-full px-4">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.embedId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>

                  <div className="p-4 mt-auto">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {video.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{video.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Udemy Courses - Coming Soon */}
          {activeTab === "udemy" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                I'm currently working on comprehensive courses for blockchain and AI development. Stay tuned!
              </p>
            </div>
          )}

          {/* Docs - Coming Soon */}
          {activeTab === "other" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Detailed documentation and developer guides are being curated. Check back later!
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

