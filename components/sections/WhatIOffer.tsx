import Link from "next/link"
import { ArrowUpRight, Brain, Code, Database, Cpu, Server, Layers, Zap, LineChart } from "lucide-react"
import Reveal from "@/components/Reveal"

const services = [
  { title: "AI and Blockchain Advice", description: "I help you decide how to use AI and blockchain in your product, and what to build first.", icon: <Brain className="h-10 w-10 text-primary" /> },
  { title: "Smart Contract Development", description: "I write and test smart contracts for DeFi, NFTs, DAOs, and custom blockchain apps.", icon: <Code className="h-10 w-10 text-primary" /> },
  { title: "DApp Development", description: "I plan and build complete blockchain apps, from the smart contract to the website people use.", icon: <Layers className="h-10 w-10 text-primary" /> },
  { title: "AI Features", description: "I add machine learning models and AI features to your app, and help you study your data.", icon: <Cpu className="h-10 w-10 text-primary" /> },
  { title: "Blockchain Servers", description: "I set up and run blockchain nodes, networks, and servers for your project.", icon: <Server className="h-10 w-10 text-primary" /> },
  { title: "Token Design", description: "I help you plan how your token works: supply, rewards, and how it keeps its value over time.", icon: <LineChart className="h-10 w-10 text-primary" /> },
  { title: "Technical Review", description: "I check blockchain projects and smart contracts for investors, and report the problems I find.", icon: <Database className="h-10 w-10 text-primary" /> },
  { title: "Web3 Training", description: "I teach teams blockchain development and AI with training sessions and workshops.", icon: <Zap className="h-10 w-10 text-primary" /> },
]

export default function WhatIOffer() {
  return (
    <section id="services" className="section-padding press-services">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Services</p><h2>HOW I CAN HELP<span className="press-red-period">.</span></h2></div><Link href="/contact" className="press-text-link">Ask about a service <ArrowUpRight size={17} /></Link></Reveal>
      <div className="press-service-grid">{services.map((service, index) => <Reveal as="article" key={service.title} delay={(index % 4) * 0.08}><div className="press-service-top"><span className="press-eyebrow">0{index + 1}</span>{service.icon}</div><h3>{service.title}</h3><p>{service.description}</p></Reveal>)}</div>
    </section>
  )
}
