import Reveal from "@/components/Reveal"

const groups = [
  { title: "Blockchain", items: ["Solidity", "Rust / CosmWasm", "Cosmos SDK", "ZK rollups", "DeFi apps"] },
  { title: "Languages", items: ["Rust", "Go", "Python", "TypeScript", "Solidity"] },
  { title: "Cloud and servers", items: ["Docker", "AWS / GCP", "CI/CD", "Tendermint", "IBC"] },
  { title: "AI and web apps", items: ["Machine learning", "TensorFlow / PyTorch", "Node.js", "Next.js", "Gas optimization"] },
]

export default function Skills() {
  return (
    <section id="skills" className="section-padding press-skills">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">What I work with</p><h2>MY SKILLS<span className="press-red-period">.</span></h2></div></Reveal>
      <div className="press-skill-grid">{groups.map((group, index) => <Reveal key={group.title} delay={index * 0.1}><span className="press-eyebrow">0{index + 1}</span><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></Reveal>)}</div>
    </section>
  )
}
