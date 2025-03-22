"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Cpu, Server, Layers } from "lucide-react"

const skills = [
  {
    category: "Blockchain",
    items: [
      { name: "Solidity", level: 95 },
      { name: "Ethereum", level: 90 },
      { name: "Smart Contracts", level: 95 },
      { name: "Web3.js", level: 85 },
      { name: "Hardhat", level: 80 },
    ],
    icon: <Layers className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    category: "Programming",
    items: [
      { name: "Rust", level: 85 },
      { name: "Go", level: 80 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Python", level: 75 },
    ],
    icon: <Code className="h-6 w-6" />,
    color: "from-green-500 to-emerald-400",
  },
  {
    category: "AI & ML",
    items: [
      { name: "TensorFlow", level: 75 },
      { name: "PyTorch", level: 70 },
      { name: "LLM Integration", level: 85 },
      { name: "AI Tools", level: 90 },
      { name: "Data Analysis", level: 80 },
    ],
    icon: <Cpu className="h-6 w-6" />,
    color: "from-purple-500 to-violet-400",
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 85 },
      { name: "GraphQL", level: 80 },
      { name: "RESTful APIs", level: 90 },
      { name: "Microservices", level: 75 },
    ],
    icon: <Server className="h-6 w-6" />,
    color: "from-red-500 to-pink-400",
  },
]

function SkillCard({ category, items, icon, color, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-xl p-6 h-full"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        {icon}
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

