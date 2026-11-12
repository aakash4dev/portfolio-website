import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { personalProjects } from "@/lib/projects"
import ProjectRows from "@/components/site/ProjectRows"
import Reveal from "@/components/Reveal"

export default function Projects() {
  const selected = personalProjects.slice(0, 3)
  return (
    <section id="projects" className="press-work press-container">
      <Reveal className="press-index-heading" from="left"><h2>FEATURED<br />PROJECTS<span className="press-red-period">.</span></h2><div className="press-index-note"><span className="press-small-rule" /><p>Products I built<br />and shipped.</p><Link href="/projects" className="press-text-link">See all projects <ArrowUpRight size={16} /></Link></div></Reveal>
      <ProjectRows projects={selected} showStatus />
    </section>
  )
}
