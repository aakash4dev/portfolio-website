import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="glass mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-bold gradient-text">
              Aakash<span className="text-primary">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Blockchain x AI Developer</p>
          </div>

          <div className="flex space-x-6">
            <Link
              href="https://github.com/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://x.com/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://linkedin.com/in/aakash4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Aakash. All rights reserved.</p>
          <p className="mt-1">Built with Next.js, Three.js, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

