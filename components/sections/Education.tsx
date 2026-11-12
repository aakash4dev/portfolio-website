import { education } from "@/lib/experience"
import Reveal from "@/components/Reveal"

export default function Education() {
  return (
    <section id="education" className="section-padding press-experience">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Degrees</p><h2>EDUCATION<span className="press-red-period">.</span></h2></div></Reveal>
      <div className="press-experience-list">{education.map((item, index) => <Reveal as="article" key={item.role} delay={index * 0.06}><div className="press-experience-date"><span>{item.period}</span><p>{item.location}</p></div><div><p className="press-eyebrow">{item.company}</p><h3>{item.role}</h3><ul>{item.description.map((line) => <li key={line}>{line}</li>)}</ul><div className="press-project-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Reveal>)}</div>
    </section>
  )
}
