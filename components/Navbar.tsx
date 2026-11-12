"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Github, Menu, X, Youtube } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { navLinks } from "@/lib/site"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) }
    const scroll = () => setScrolled(window.scrollY > 12)
    scroll()
    document.addEventListener("keydown", escape)
    window.addEventListener("scroll", scroll, { passive: true })
    return () => { document.removeEventListener("keydown", escape); window.removeEventListener("scroll", scroll) }
  }, [])

  return (
    <header className={`press-header ${scrolled ? "press-header-scrolled" : ""}`}>
      <div className="press-header-inner press-container">
        <Link href="/" className="press-wordmark" aria-label="Aakash — home"><span className="press-square" />Aakash<span className="press-wordmark-dot">.</span></Link>
        <span className="press-header-caption">AI &amp; Web3 Engineer<span>Portfolio and blog</span></span>
        <nav className="press-desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => <Link key={link.name} href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>{link.name}</Link>)}
        </nav>
        <div className="press-header-social"><a href="https://github.com/aakash4dev" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={17} /></a><a href="https://www.youtube.com/@aakash4dev" target="_blank" rel="noopener noreferrer" aria-label="YouTube channel"><Youtube size={19} /></a></div>
        <button type="button" className="press-menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-navigation" className="press-mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            {navLinks.map((link, index) => (
              <motion.div key={link.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}>
                <Link href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined} onClick={() => setOpen(false)}>{link.name}<ArrowUpRight size={18} /></Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
