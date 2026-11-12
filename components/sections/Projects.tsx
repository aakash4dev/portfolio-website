import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"
import { personalProjects } from "@/lib/projects"
import Reveal from "@/components/Reveal"

export default function Projects() {
  const selected = personalProjects.slice(0, 3)
  return (
    <section id="projects" className="section-padding press-featured">
      <Reveal className="press-section-heading">
        <div><p className="press-eyebrow">Selected work</p><h2>FEATURED PROJECTS<span className="press-red-period">.</span></h2></div>
        <Link href="/projects" className="press-text-link">See all projects <ArrowUpRight size={17} /></Link>
      </Reveal>
      <div className="press-featured-grid">
        {selected.map((project, index) => {
          const href = project.demo || project.github
          const host = project.demo ? new URL(project.demo).host : "github.com"
          return (
            <Reveal as="article" key={project.title} className="press-featured-card" delay={index * 0.1}>
              <div className="press-featured-shot">
                <div className="press-featured-bar" aria-hidden="true"><i /><i /><i /><span>{host}</span></div>
                <img src={project.image} alt={`Screenshot of ${project.title}`} width="1854" height="961" loading="lazy" />
              </div>
              <div className="press-featured-body">
                <div className="press-featured-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="press-featured-status">{project.demo ? "Live product" : "Open source"}</span>
                </div>
                <h3><a href={href} target="_blank" rel="noopener noreferrer">{project.title}</a></h3>
                <p>{project.description}</p>
                <div className="press-project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="press-featured-links">
                  <span>{project.demo ? "Visit site" : "View code"} <ArrowUpRight size={15} /></span>
                  {project.github && project.demo && <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub`}><Github size={16} /></a>}
                  {project.github && !project.demo && <Github size={16} aria-hidden="true" />}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
