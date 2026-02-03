import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="glass py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mt-8 border-t border-border/30 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Aakash. All rights reserved.</p>
          <p className="mt-1">Built with Next.js, Three.js, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

