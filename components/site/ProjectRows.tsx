import { ArrowUpRight, Github } from "lucide-react"
import type { PortfolioProject } from "@/lib/projects"
import Reveal from "@/components/Reveal"

export default function ProjectRows({ projects }: { projects: PortfolioProject[] }) {
  return <div className="press-project-rows">{projects.map((project, index) => (
    <Reveal as="article" key={project.title} className="press-project-row" delay={Math.min(index, 4) * 0.08}>
      <span className="press-project-number">{String(index + 1).padStart(2, "0")}</span>
      <a href={project.demo || project.github} target="_blank" rel="noopener noreferrer" className="press-project-image" aria-label={`Open ${project.title}`}><img src={project.image} alt={`Screenshot of ${project.title}`} width="400" height="260" loading="lazy" /></a>
      <div className="press-project-copy"><h3><a href={project.demo || project.github} target="_blank" rel="noopener noreferrer">{project.title}</a></h3><p>{project.description}</p><div className="press-project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      <div className="press-project-actions">{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub`}><Github size={18} /></a>}<a href={project.demo || project.github} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}><ArrowUpRight size={25} /></a></div>
    </Reveal>
  ))}</div>
}
