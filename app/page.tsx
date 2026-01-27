import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Experience from "@/components/sections/Experience"
import Projects from "@/components/sections/Projects"
import WhatIOffer from "@/components/sections/WhatIOffer"
import Contact from "@/components/sections/Contact"
import FloatingContact from "@/components/FloatingContact"
import GoToTop from "@/components/GoToTop"

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <WhatIOffer />
      <Contact />
      <FloatingContact />
      <GoToTop />
    </main>
  )
}

