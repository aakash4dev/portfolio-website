import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Globe, Twitter, Linkedin, Users, DollarSign, Calendar, FileText } from "lucide-react"
import Image from "next/image"

// Sample upcoming projects data
const projects = [
  {
    id: "project1",
    name: "CrossChainBridge",
    description:
      "A secure and efficient cross-chain bridge that enables seamless asset transfers between multiple blockchain networks with minimal fees.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Infrastructure",
    estimatedCost: "$120,000",
    fundingGoal: 120000,
    fundingRaised: 85000,
    timeline: "6 months",
    startDate: "April 2023",
    website: "https://crosschainbridge.example.com",
    github: "https://github.com/crosschainbridge",
    twitter: "https://twitter.com/crosschainbridge",
    linkedin: "https://linkedin.com/company/crosschainbridge",
    whitepaper: "/placeholder.svg", // This would be a PDF link in a real scenario
    team: [
      { name: "Aakash", role: "Lead Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Elena Kim", role: "Security Expert", image: "/placeholder.svg?height=100&width=100" },
      { name: "Marcus Johnson", role: "Product Manager", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Solidity", "Rust", "Polkadot", "Ethereum"],
  },
  {
    id: "project2",
    name: "AIOracle",
    description:
      "A decentralized oracle network that uses AI to aggregate and validate real-world data for smart contracts with high accuracy and reliability.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Oracle",
    estimatedCost: "$180,000",
    fundingGoal: 180000,
    fundingRaised: 120000,
    timeline: "8 months",
    startDate: "May 2023",
    website: "https://aioracle.example.com",
    github: "https://github.com/aioracle",
    twitter: "https://twitter.com/aioracle",
    linkedin: "https://linkedin.com/company/aioracle",
    whitepaper: "/placeholder.svg", // This would be a PDF link in a real scenario
    team: [
      { name: "Aakash", role: "AI & Blockchain Architect", image: "/placeholder.svg?height=100&width=100" },
      { name: "Sophia Chen", role: "Data Scientist", image: "/placeholder.svg?height=100&width=100" },
      { name: "David Rodriguez", role: "Smart Contract Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Emma Thompson", role: "Business Development", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["TensorFlow", "Chainlink", "Solidity", "Python"],
  },
  {
    id: "project3",
    name: "PrivacyLayer",
    description:
      "A privacy-focused layer 2 solution that enables confidential transactions and smart contracts while maintaining compliance with regulations.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Privacy",
    estimatedCost: "$250,000",
    fundingGoal: 250000,
    fundingRaised: 150000,
    timeline: "12 months",
    startDate: "June 2023",
    website: "https://privacylayer.example.com",
    github: "https://github.com/privacylayer",
    twitter: "https://twitter.com/privacylayer",
    linkedin: "https://linkedin.com/company/privacylayer",
    whitepaper: "/placeholder.svg", // This would be a PDF link in a real scenario
    team: [
      { name: "Aakash", role: "Technical Lead", image: "/placeholder.svg?height=100&width=100" },
      { name: "Olivia Martinez", role: "Cryptography Expert", image: "/placeholder.svg?height=100&width=100" },
      { name: "James Wilson", role: "Protocol Engineer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Sarah Lee", role: "Compliance Officer", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Zero-Knowledge Proofs", "Optimistic Rollups", "Ethereum", "Rust"],
  },
  {
    id: "project4",
    name: "DeFiInsurance",
    description:
      "A decentralized insurance protocol that protects users against smart contract vulnerabilities, hacks, and other DeFi risks with automated claims processing.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "DeFi",
    estimatedCost: "$200,000",
    fundingGoal: 200000,
    fundingRaised: 90000,
    timeline: "9 months",
    startDate: "July 2023",
    website: "https://defiinsurance.example.com",
    github: "https://github.com/defiinsurance",
    twitter: "https://twitter.com/defiinsurance",
    linkedin: "https://linkedin.com/company/defiinsurance",
    whitepaper: "/placeholder.svg", // This would be a PDF link in a real scenario
    team: [
      { name: "Aakash", role: "Smart Contract Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Michael Brown", role: "Risk Analyst", image: "/placeholder.svg?height=100&width=100" },
      { name: "Jessica Taylor", role: "Actuary", image: "/placeholder.svg?height=100&width=100" },
      { name: "Daniel Kim", role: "Frontend Developer", image: "/placeholder.svg?height=100&width=100" }
    ],
    technologies: ["Solidity", "React", "The Graph", "Chainlink"],
  },
  {
    id: "project5",
    name: "MetaverseDAO",
    description:
      "A decentralized autonomous organization that governs a virtual metaverse world with land ownership, digital assets, and community-driven development.",
    logo: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=400&width=800",
    category: "Metaverse",
    estimatedCost: "$300,000",
    fundingGoal: 300000,
    fundingRaised: 180000,
    timeline: "15 months",
    startDate: "August 2023",
    website: "https://metaversedao.example.com",
    github: "https://github.com/metaversedao",
    twitter: "https://twitter.com/metaversedao",
    linkedin: "https://linkedin.com/company/metaversedao",
    whitepaper: "/placeholder.svg", // This would be a PDF link in a real scenario
    team: [
      { name: "Aakash", role: "Blockchain Architect", image: "/placeholder.svg?height=100&width=100" },
      { name: "Ryan Garcia", role: "3D Artist", image: "/placeholder.svg?height=100&width=100" },
      { name: "Natalie Wong", role: "Game Developer", image: "/placeholder.svg?height=100&width=100" },
      { name: "Thomas Johnson", role: "Community Manager", image: "/placeholder.svg?height=100&width=100" },
    ],
    technologies: ["Unity", "WebGL", "Solidity", "IPFS"],
  },
]

const categories = ["All", "Infrastructure", "Oracle", "Privacy", "DeFi", "Metaverse"]

export default function SeedfundPage() {
  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Seedfund</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upcoming blockchain and AI projects seeking funding and collaboration. Join us in building the future of
          decentralized technology.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm py-2">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="glass border-border/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image src={project.banner || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
              <div className="absolute top-4 left-4 h-12 w-12 rounded-full overflow-hidden bg-background/80 p-1">
                <div className="relative h-full w-full">
                  <Image
                    src={project.logo || "/placeholder.svg"}
                    alt={`${project.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                {project.category}
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <CardDescription className="text-base">{project.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Funding Progress</span>
                  <span className="text-sm font-medium">
                    ${project.fundingRaised.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <Progress value={(project.fundingRaised / project.fundingGoal) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="text-sm font-medium">{project.estimatedCost}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm font-medium">{project.timeline}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Team</p>
                <div className="flex flex-wrap gap-3">
                  {project.team.map((member, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden mb-1">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-center">{member.name}</p>
                      <p className="text-xs text-muted-foreground text-center">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-primary/5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-border/30 pt-6">
              <div className="flex space-x-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {project.twitter && (
                  <a
                    href={project.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {project.linkedin && (
                  <a
                    href={project.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex gap-3 ml-auto">
                <Button variant="outline" asChild>
                  <a href={project.whitepaper} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Whitepaper
                  </a>
                </Button>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Join Project
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}

