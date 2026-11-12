"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"
import { contributions, personalProjects } from "@/lib/projects"
import ProjectRows from "./ProjectRows"
import Reveal from "@/components/Reveal"

export default function ProjectLibrary() {
  const [query, setQuery] = useState("")
  const projects = personalProjects.filter((project) => `${project.title} ${project.description} ${project.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <main className="press-page press-container">
      <header className="press-page-heading"><p className="press-eyebrow">Projects / Open source</p><h1>MY PROJECTS<span className="press-red-period">.</span></h1><p>Developer tools, AI apps, and blockchain software.<br className="hidden sm:block" /> Click a project to open it.</p></header>
      <label className="press-search"><Search size={18} /><span className="sr-only">Search projects</span><input type="search" placeholder="Search by name, language, or tool" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <p className="press-result-count" role="status">{projects.length} {projects.length === 1 ? "project" : "projects"}</p>
      {projects.length ? <ProjectRows projects={projects} /> : <div className="press-no-results"><p>No project matches “{query}”.</p><button type="button" className="press-text-link" onClick={() => setQuery("")}>Clear search</button></div>}
      <section id="company-projects" className="press-contributions"><Reveal className="press-section-heading"><div><p className="press-eyebrow">Work for companies</p><h2>COMPANY PROJECTS<span className="press-red-period">.</span></h2></div><Link href="/#experience" className="press-text-link">See my experience <ArrowUpRight size={17} /></Link></Reveal><div className="press-contribution-list">{contributions.map((item, index) => <Reveal as="article" key={`${item.company}-${item.title}`} delay={(index % 2) * 0.08}><span className="press-eyebrow">{item.company}</span><h3>{item.title}</h3><p>{item.description}</p><div className="press-project-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Reveal>)}</div></section>
      <Reveal className="press-next-links"><p className="press-eyebrow">What next?</p><div><Link href="/contact" className="press-text-link">Contact me about a project <ArrowUpRight size={17} /></Link><Link href="/blogs" className="press-text-link">Read my blog <ArrowUpRight size={17} /></Link><Link href="/tutorials" className="press-text-link">Watch my tutorials <ArrowUpRight size={17} /></Link></div></Reveal>
    </main>
  )
}
