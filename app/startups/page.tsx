"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Globe, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample startup data
const startups = [
  {
    id: "startup1",
    name: "DeFiHub",
    description:
      "A decentralized finance platform that aggregates multiple DeFi protocols to provide users with the best yields and opportunities.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "DeFi",
    status: "Live",
    website: "https://defihub.example.com",
    github: "https://github.com/defihub",
    twitter: "https://twitter.com/defihub",
    linkedin: "https://linkedin.com/company/defihub",
    team: [
      { name: "Aakash", role: "Founder & Lead Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Sarah Chen", role: "CTO", image: "/placeholder.svg?height=100&width=100" },
      { name: "Michael Rodriguez", role: "Smart Contract Engineer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Priya Sharma", role: "UI/UX Designer", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Solidity", "React", "The Graph", "Ethereum"],
  },
  {
    id: "startup2",
    name: "NFTVerse",
    description:
      "An NFT marketplace focused on digital art and collectibles with unique social features and creator royalties.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "NFT",
    status: "Beta",
    website: "https://nftverse.example.com",
    github: "https://github.com/nftverse",
    twitter: "https://twitter.com/nftverse",
    linkedin: "https://linkedin.com/company/nftverse",
    team: [
      { name: "Aakash", role: "Technical Advisor", image: "/placeholder.svg?height=100&width=100" },
      { name: "Jessica Wong", role: "CEO", image: "/placeholder.svg?height=100&width=100" },
      { name: "David Kim", role: "Lead Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Emma Johnson", role: "Marketing Director", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["ERC-721", "IPFS", "Next.js", "Polygon"],
  },
  {
    id: "startup3",
    name: "ChainGuard",
    description:
      "A blockchain security platform that provides automated smart contract auditing and continuous monitoring for vulnerabilities.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Security",
    status: "Live",
    website: "https://chainguard.example.com",
    github: "https://github.com/chainguard",
    twitter: "https://twitter.com/chainguard",
    linkedin: "https://linkedin.com/company/chainguard",
    team: [
      { name: "Aakash", role: "Co-founder & Security Lead", image: "/placeholder.svg?height=100&width=100" },
      { name: "Alex Thompson", role: "Co-founder & CEO", image: "/placeholder.svg?height=100&width=100" },
      { name: "Sophia Martinez", role: "Security Researcher", image: "/placeholder.svg?height=100&width=100" },
      { name: "James Wilson", role: "Full-Stack Developer", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Solidity", "Python", "Machine Learning", "Ethereum"],
  },
  {
    id: "startup4",
    name: "DataChain",
    description:
      "A decentralized data marketplace that allows users to buy, sell, and share data securely with privacy-preserving features.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Data",
    status: "Alpha",
    website: "https://datachain.example.com",
    github: "https://github.com/datachain",
    twitter: "https://twitter.com/datachain",
    linkedin: "https://linkedin.com/company/datachain",
    team: [
      { name: "Aakash", role: "Blockchain Architect", image: "/placeholder.svg?height=100&width=100" },
      { name: "Olivia Brown", role: "CEO", image: "/placeholder.svg?height=100&width=100" },
      { name: "Daniel Lee", role: "Data Scientist", image: "/placeholder.svg?height=100&width=100" },
      { name: "Zoe Garcia", role: "Backend Developer", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Filecoin", "IPFS", "Zero-Knowledge Proofs", "React"],
  },
  {
    id: "startup5",
    name: "AIGovernance",
    description:
      "A DAO platform that uses AI to enhance governance processes and decision-making for decentralized organizations.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "DAO",
    status: "Development",
    website: "https://aigovernance.example.com",
    github: "https://github.com/aigovernance",
    twitter: "https://twitter.com/aigovernance",
    linkedin: "https://linkedin.com/company/aigovernance",
    team: [
      { name: "Aakash", role: "AI & Blockchain Lead", image: "/placeholder.svg?height=100&width=100" },
      { name: "Ryan Taylor", role: "CEO", image: "/placeholder.svg?height=100&width=100" },
      { name: "Natalie Chen", role: "AI Engineer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Marcus Johnson", role: "Product Manager", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["TensorFlow", "Solidity", "Aragon", "Ethereum"],
  },
  {
    id: "startup6",
    name: "GreenChain",
    description:
      "A sustainability-focused blockchain platform that tracks carbon credits and environmental impact with transparent verification.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Sustainability",
    status: "Beta",
    website: "https://greenchain.example.com",
    github: "https://github.com/greenchain",
    twitter: "https://twitter.com/greenchain",
    linkedin: "https://linkedin.com/company/greenchain",
    team: [
      { name: "Aakash", role: "Technical Advisor", image: "/placeholder.svg?height=100&width=100" },
      { name: "Elena Rodriguez", role: "Founder & CEO", image: "/placeholder.svg?height=100&width=100" },
      { name: "Thomas Wright", role: "Environmental Scientist", image: "/placeholder.svg?height=100&width=100" },
      { name: "Leila Patel", role: "Blockchain Developer", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Celo", "React", "IoT", "Smart Contracts"],
  },
]

const categories = ["All", "DeFi", "NFT", "Security", "Data", "DAO", "Sustainability"]
const statuses = ["All", "Live", "Beta", "Alpha", "Development"]

export default function StartupsPage() {
  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Startups</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Innovative blockchain and AI projects I've founded, co-founded, or contributed to as a technical advisor.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 justify-center">
        <Tabs defaultValue="All" className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm py-2">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue="All" className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 h-auto">
            {statuses.map((status) => (
              <TabsTrigger key={status} value={status} className="text-xs md:text-sm py-2">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {startups.map((startup) => (
          <Link href={`/startups/${startup.id}`} key={startup.id} className="group">
            <Card className="glass border-border/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={startup.banner || "/placeholder.svg"}
                  alt={startup.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 h-12 w-12 rounded-full overflow-hidden bg-background/80 p-1">
                  <div className="relative h-full w-full">
                    <Image
                      src={startup.logo || "/placeholder.svg"}
                      alt={`${startup.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {startup.status}
                </div>
                <div className="absolute bottom-4 right-4 bg-background/80 text-primary text-xs font-medium px-2 py-1 rounded-full">
                  {startup.category}
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{startup.name}</CardTitle>
                <CardDescription className="line-clamp-2">{startup.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {startup.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-primary/5">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex -space-x-2">
                  {startup.team.slice(0, 4).map((member, index) => (
                    <div
                      key={index}
                      className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-background"
                    >
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                  ))}
                  {startup.team.length > 4 && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs border-2 border-background">
                      +{startup.team.length - 4}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t border-border/30 pt-4">
                <div className="flex space-x-2">
                  {startup.github && (
                    <a
                      href={startup.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {startup.website && (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {startup.twitter && (
                    <a
                      href={startup.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

