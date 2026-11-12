import Reveal from "@/components/Reveal"

const groups = [
  { title: "Blockchain & Web3", items: ["Solidity", "Rust / CosmWasm", "Cosmos SDK", "ZK rollups", "DeFi apps", "Gas optimization"] },
  { title: "Languages", items: ["Rust", "Go", "Python", "TypeScript", "Solidity", "JavaScript"] },
  { title: "Backend & Infrastructure", items: ["Node.js", "Docker", "AWS / GCP", "CI/CD", "Tendermint", "IBC"] },
  { title: "AI & Full-stack", items: ["Machine learning", "Deep learning", "LLM apps", "TensorFlow / PyTorch", "Next.js", "React"] },
]

export default function Skills() {
  return (
    <section id="skills" className="section-padding press-skills">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">What I work with</p><h2>TECHNICAL SKILLS<span className="press-red-period">.</span></h2></div></Reveal>
      <div className="press-skill-grid">{groups.map((group, index) => <Reveal key={group.title} delay={index * 0.1}><span className="press-eyebrow">0{index + 1}</span><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></Reveal>)}</div>
    </section>
  )
}
