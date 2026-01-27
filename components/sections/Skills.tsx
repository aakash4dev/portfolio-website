"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Cpu, Server, Layers } from "lucide-react"

const skills = [
  {
    category: "Core Blockchain",
    items: [
      { name: "Smart Contract Dev", level: 95 },
      { name: "Solidity", level: 95 },
      { name: "Rust (CosmWasm)", level: 90 },
      { name: "ZK-Sequencer/Prover", level: 85 },
      { name: "DeFi Architecture", level: 90 },
    ],
    icon: <Layers className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    category: "Languages",
    items: [
      { name: "Rust (Advanced)", level: 90 },
      { name: "Golang", level: 85 },
      { name: "Solidity", level: 95 },
      { name: "Python", level: 80 },
      { name: "TypeScript", level: 85 },
    ],
    icon: <Code className="h-6 w-6" />,
    color: "from-green-500 to-emerald-400",
  },
  {
    category: "Infrastructure",
    items: [
      { name: "Docker", level: 85 },
      { name: "AWS / GCP", level: 80 },
      { name: "CI/CD", level: 85 },
      { name: "Tendermint", level: 90 },
      { name: "IBC", level: 85 },
    ],
    icon: <Server className="h-6 w-6" />,
    color: "from-purple-500 to-violet-400",
  },
  {
    category: "AI & Other",
    items: [
      { name: "Machine Learning", level: 75 },
      { name: "TensorFlow/PyTorch", level: 70 },
      { name: "Backend (Node.js)", level: 85 },
      { name: "Frontend (Next.js)", level: 80 },
      { name: "Gas Optimization", level: 95 },
    ],
    icon: <Cpu className="h-6 w-6" />,
    color: "from-red-500 to-pink-400",
  },
]

interface SkillItem {
  name: string
  level: number
}

interface SkillCardProps {
  category: string
  items: SkillItem[]
  icon: React.ReactNode
  color: string
  index: number
}

import TiltCard from "@/components/ui/TiltCard"

// ... (imports remain same)

function SkillCard({ category, items, icon, color, index }: SkillCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <TiltCard className="rounded-xl p-6 h-full glass" glareColor="rgba(255, 255, 255, 0.1)">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4 perspective-1000 group`}>
          <div className="transition-transform duration-500 group-hover:rotate-y-180 transform-style-3d">
            {icon}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">{category}</h3>

        <div className="space-y-4">
          {items.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="skills" className="section-padding">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2">
          My <span className="gradient-text">Skills</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />

        <motion.p variants={itemVariants} className="text-lg max-w-2xl mx-auto text-muted-foreground">
          I specialize in blockchain development and AI integration, with expertise in various programming languages and
          frameworks.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <SkillCard
            key={skill.category}
            category={skill.category}
            items={skill.items}
            icon={skill.icon}
            color={skill.color}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

