import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Experience from "@/components/sections/Experience"
import Education from "@/components/sections/Education"
import Projects from "@/components/sections/Projects"
import WhatIOffer from "@/components/sections/WhatIOffer"
import Contact from "@/components/sections/Contact"
import Tutorials from "@/components/sections/Tutorials"
import WritingIndex from "@/components/site/WritingIndex"
import GoToTop from "@/components/GoToTop"

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <WritingIndex />
      <Tutorials />
      <WhatIOffer />
      <Contact />
      <GoToTop />
    </main>
  )
}

