"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Mail,
  Coffee,
  Globe,
  FileText
} from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://www.github.com/aakash4dev",
      icon: Github,
      color: "text-gray-200",
      bgColor: "bg-gray-500/10",
      description: "Open Source"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/aakash4dev",
      icon: Linkedin,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      description: "Professional"
    },
    {
      name: "Twitter",
      url: "https://www.twitter.com/aakash4dev",
      icon: Twitter,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      description: "Thoughts & Updates"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@aakash4dev",
      icon: Youtube,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      description: "Tutorials & Tech"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/aakash4dev",
      icon: Instagram,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "Life & Tech"
    },
    {
      name: "Medium",
      url: "https://medium.com/@aakash4dev",
      icon: FileText,
      color: "text-white",
      bgColor: "bg-white/10",
      description: "Articles"
    },
    {
      name: "Email",
      url: "mailto:aakash4dev.me@gmail.com",
      icon: Mail,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Contact Me"
    },
    {
      name: "Buy Me a Coffee",
      url: "https://coff.ee/aakash4dev",
      icon: Coffee,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Support My Work"
    },
  ]

  return (
    <section id="contact" className="section-padding">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2">
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />
          <motion.p variants={itemVariants} className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Connect with me across various platforms. I'm always open to discussing new projects and opportunities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target={link.name === "Email" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              variants={itemVariants}
              className="glass p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-all duration-300 group flex items-center space-x-4 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg ${link.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <link.icon className={`h-6 w-6 ${link.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{link.name}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

