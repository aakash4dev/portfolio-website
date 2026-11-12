import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { email, socialLinks } from "@/lib/site"
import Reveal from "@/components/Reveal"

// Short contact block shown at the bottom of pages. The full details are on /contact.
export default function Contact() {
  return (
    <section id="contact" className="press-contact">
      <div className="press-container press-contact-grid">
        <Reveal>
          <p className="press-eyebrow">Contact</p>
          <h2>LET'S WORK<br />TOGETHER<span>.</span></h2>
          <p>Do you have a project, a job, or a question?<br />Send me a message.</p>
          <div className="press-contact-actions"><Link href="/contact" className="press-button press-button-light">Go to the contact page <ArrowRight size={17} /></Link><a href={`mailto:${email}`} className="press-contact-email">{email} <ArrowUpRight size={22} /></a></div>
        </Reveal>
        <Reveal className="press-contact-links" delay={0.15}>{socialLinks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowUpRight size={18} /></a>)}</Reveal>
      </div>
    </section>
  )
}
