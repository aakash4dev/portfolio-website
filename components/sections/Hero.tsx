"use client"

import Link from "next/link"
import { useRef, useState, type PointerEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, ArrowUpRight, Github, Layers, Minus, Youtube } from "lucide-react"

export default function Hero() {
  const section = useRef<HTMLElement>(null)
  const [unfolded, setUnfolded] = useState(false)
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(7)
  const pointerY = useMotionValue(-13)
  const rotateX = useSpring(pointerX, { stiffness: 130, damping: 24 })
  const rotateY = useSpring(pointerY, { stiffness: 130, damping: 24 })
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] })
  const rise = useTransform(scrollYProgress, [0, 1], [0, -65])

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set(7 - ((event.clientY - box.top) / box.height - 0.5) * 9)
    pointerY.set(-13 + ((event.clientX - box.left) / box.width - 0.5) * 12)
  }

  function reset() { pointerX.set(7); pointerY.set(-13) }
  const transition = { duration: reduceMotion ? 0 : 0.55, ease: "easeOut" as const }

  return (
    <section ref={section} id="home" className="press-hero press-container">
      <motion.div className="press-hero-kicker" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}><span className="press-square press-pulse" /> Senior Blockchain Engineer and AI Developer</motion.div>
      <div className="press-hero-grid">
        <div className="press-hero-type">
          <h1 className="press-headline" aria-label="Build. Write. Teach.">
            {["BUILD.", "WRITE.", "TEACH."].map((word, index) => (
              <motion.span key={word} className={index === 2 ? "press-ship" : undefined} initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 + index * 0.14, ease: [0.2, 0.7, 0.2, 1] }}>{word}</motion.span>
            ))}
          </h1>
          <motion.div className="press-hero-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
            <p className="press-name">Aakash Singh Rajput<span>AI & Web3 Engineer</span></p>
            <p>I build software,<br className="hidden sm:block" /> write articles about how it works,<br className="hidden sm:block" /> and make tutorials.</p>
          </motion.div>
          <motion.div className="press-hero-links" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}>
            <Link href="/projects" className="press-button">See my projects <ArrowRight size={17} /></Link>
            <Link href="/blogs" className="press-text-link">Read my blog <ArrowUpRight size={17} /></Link>
            <Link href="/contact" className="press-text-link">Contact me <ArrowUpRight size={17} /></Link>
          </motion.div>
        </div>

        <motion.div className="press-stage-wrap" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
          <div className="press-stage" onPointerMove={move} onPointerLeave={reset}>
            <motion.div className="press-browser" style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY, rotateZ: reduceMotion ? 0 : -4, y: reduceMotion ? 0 : rise }}>
              <div className="press-browser-bar"><span className="press-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>aakash4dev.com</span><Minus size={14} /></div>
              <div className="press-browser-depth" aria-hidden="true" />

              <motion.div className="press-sheet press-code-sheet" initial={false} animate={{ z: unfolded ? 70 : 35, y: unfolded ? -15 : 0, rotateX: unfolded && !reduceMotion ? 5 : 0 }} transition={transition}>
                <div className="press-sheet-label"><span>/ code</span><span>01</span></div>
                <div className="press-code-preview" aria-label="Illustrative code listing">
                  <span><b>1</b> <em>const</em> focus = [</span>
                  <span><b>2</b>   <strong>"AI"</strong>, <strong>"Web3"</strong>,</span>
                  <span><b>3</b>   <strong>"useful software"</strong></span>
                  <span><b>4</b> ];</span>
                </div>
              </motion.div>

              <motion.div className="press-sheet press-project-sheet" initial={false} animate={{ z: unfolded ? 115 : 75, y: 0, rotateX: unfolded && !reduceMotion ? -3 : 0 }} transition={transition}>
                <Link href="/projects" className="press-sheet-link">
                  <div><div className="press-sheet-label"><span>/ project</span><ArrowUpRight size={16} /></div><h2>TheDevKits</h2><p>Free online tools<br />for developers.</p></div>
                  <div className="press-sheet-image"><img src="/projects/thedevkits.png" alt="Screenshot of TheDevKits website" width="240" height="160" /></div>
                </Link>
              </motion.div>

              <motion.div className="press-sheet press-article-sheet" initial={false} animate={{ z: unfolded ? 165 : 115, y: unfolded ? 15 : 0, rotateX: unfolded && !reduceMotion ? -6 : 0 }} transition={transition}>
                <Link href="/blogs/understanding-fhe-in-blockchain" className="press-sheet-link">
                  <div><div className="press-sheet-label"><span>/ article</span><ArrowUpRight size={16} /></div><h2>What is FHE<br />in blockchain?</h2><p>A simple guide to encrypted data.</p></div>
                  <div className="press-sheet-image"><img src="/blogs/fhe.png" alt="Cover image of the FHE article" width="240" height="160" /></div>
                </Link>
              </motion.div>
              <div className="press-browser-bottom"><span>Code / Projects / Blog</span><span>Move your mouse over the card</span></div>
            </motion.div>
          </div>
          <button type="button" className="press-unfold" onClick={() => setUnfolded(!unfolded)} aria-pressed={unfolded}><Layers size={15} /> {unfolded ? "Close the cards" : "Open the cards"}<span aria-hidden="true">↗</span></button>
        </motion.div>
      </div>
      <div className="press-hero-bottom"><span>Find me online:</span><div><a href="https://github.com/aakash4dev" target="_blank" rel="noopener noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a><a href="https://www.youtube.com/@aakash4dev" target="_blank" rel="noopener noreferrer"><Youtube size={16} /> YouTube <ArrowUpRight size={13} /></a></div></div>
    </section>
  )
}
