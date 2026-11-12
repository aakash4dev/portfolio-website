import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { experiences } from "@/lib/experience"
import Reveal from "@/components/Reveal"

export default function Experience() {
  return (
    <section id="experience" className="section-padding press-experience">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Jobs and education</p><h2>MY EXPERIENCE<span className="press-red-period">.</span></h2></div><Link href="/projects#company-projects" className="press-text-link">See what I built at each company <ArrowUpRight size={17} /></Link></Reveal>
      <div className="press-experience-list">{experiences.map((experience, index) => <Reveal as="article" key={`${experience.company}-${experience.period}`} delay={Math.min(index, 3) * 0.06}><div className="press-experience-date"><span>{experience.period}</span><p>{experience.location}</p></div><div><p className="press-eyebrow">{experience.company}</p><h3>{experience.role}</h3><ul>{experience.description.map((item) => <li key={item}>{item}</li>)}</ul><div className="press-project-tags">{experience.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Reveal>)}</div>
    </section>
  )
}
