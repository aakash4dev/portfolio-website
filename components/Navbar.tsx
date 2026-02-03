"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, BookOpen, Code, Video, Mail, Sparkles } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  { name: "Projects", href: "/projects", icon: <Code className="h-4 w-4" /> },
  { name: "Blogs", href: "/blogs", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Tutorials", href: "/tutorials", icon: <Video className="h-4 w-4" /> },
  { name: "Surprise", href: "/surprise", icon: <Sparkles className="h-4 w-4" /> },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold gradient-text">
          Aakash<span className="text-primary">.S</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="glass rounded-full p-1 flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 rounded-full flex items-center space-x-1"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span
                    className={`relative flex items-center space-x-1 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {link.icon}
                    <span className="relative text-sm">{link.name}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mobile-nav-glass absolute top-full left-0 right-0 py-4 px-4"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-primary text-white font-medium" : "hover:bg-primary/20 text-foreground font-medium"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

