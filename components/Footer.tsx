import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { moreLinks, navLinks, socialLinks } from "@/lib/site"

export default function Footer() {
  return (
    <footer className="press-footer">
      <div className="press-container">
        <div className="press-footer-top"><Link href="/" className="press-wordmark"><span className="press-square" />Aakash.</Link><p>Blockchain and AI engineer.<br />Open to new projects.</p><Link href="/contact" className="press-text-link">Contact me <ArrowUpRight size={18} /></Link></div>
        <div className="press-footer-nav">
          <nav aria-label="Pages"><p className="press-eyebrow">Pages</p>{navLinks.map((link) => <Link key={link.name} href={link.href}>{link.name}</Link>)}</nav>
          <nav aria-label="More pages"><p className="press-eyebrow">More</p>{moreLinks.map((link) => <Link key={link.name} href={link.href}>{link.name}</Link>)}</nav>
          <nav aria-label="Social links"><p className="press-eyebrow">Follow me</p>{socialLinks.slice(0, 4).map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}</a>)}</nav>
        </div>
        <div className="press-footer-bottom"><span>© {new Date().getFullYear()} Aakash Singh Rajput</span><span>AI &amp; Web3 Engineer</span><Link href="/contact">aakash4dev.com / contact</Link></div>
      </div>
    </footer>
  )
}
