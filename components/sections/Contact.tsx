import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { composeUrl, email, socialLinks } from "@/lib/site"
import Reveal from "@/components/Reveal"

// Dark contact block used as the site footer. The full details are on /contact.
export default function Contact() {
  return (
    <footer id="contact" className="press-contact">
      <div className="press-container">
        <div className="press-contact-grid">
          <Reveal>
            <p className="press-eyebrow">Contact</p>
            <h2>LET'S WORK<br />TOGETHER<span>.</span></h2>
            <p>Do you have a project, a job, or a question?<br />Send me a message.</p>
            <div className="press-contact-actions"><Link href="/contact" className="press-button press-button-light">Go to the contact page <ArrowRight size={17} /></Link><a href={composeUrl()} target="_blank" rel="noopener noreferrer" className="press-contact-email" aria-label={`Write to ${email} in Gmail`}>{email} <ArrowUpRight size={22} /></a></div>
          </Reveal>
          <Reveal className="press-contact-links" delay={0.15}>{socialLinks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowUpRight size={18} /></a>)}</Reveal>
        </div>
        <div className="press-contact-copyright"><span>© {new Date().getFullYear()} Aakash Singh Rajput</span><span>Blockchain &amp; AI Engineer</span></div>
      </div>
    </footer>
  )
}
