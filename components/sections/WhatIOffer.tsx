import Link from "next/link"
import { ArrowUpRight, Brain, Code, Cpu, Layers } from "lucide-react"
import Reveal from "@/components/Reveal"

const services = [
  { title: "Smart Contract and dApp Development", description: "I write, test, and deploy smart contracts in Solidity and Rust, and build the full app around them.", icon: <Code className="h-10 w-10 text-primary" /> },
  { title: "AI Agent Development", description: "I build AI agents and LLM features that work inside your product: chat assistants, search over your data, and automation.", icon: <Cpu className="h-10 w-10 text-primary" /> },
  { title: "Architecture and Code Review", description: "I design the system for your chain or app, and review code and smart contracts. You get a written report of the problems I find.", icon: <Layers className="h-10 w-10 text-primary" /> },
  { title: "Consulting and Training", description: "I help you decide what to build first with AI and blockchain, and I teach your team with workshops.", icon: <Brain className="h-10 w-10 text-primary" /> },
]

export default function WhatIOffer() {
  return (
    <section id="services" className="section-padding press-services">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Services</p><h2>HOW I CAN HELP<span className="press-red-period">.</span></h2></div><Link href="/contact" className="press-text-link">Ask about a service <ArrowUpRight size={17} /></Link></Reveal>
      <div className="press-service-grid">{services.map((service, index) => <Reveal as="article" key={service.title} delay={(index % 4) * 0.08}><div className="press-service-top"><span className="press-eyebrow">0{index + 1}</span>{service.icon}</div><h3>{service.title}</h3><p>{service.description}</p></Reveal>)}</div>
    </section>
  )
}
