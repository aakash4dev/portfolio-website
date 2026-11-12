import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Mail, MapPin } from "lucide-react"
import ContactForm from "@/components/ContactForm"
import Reveal from "@/components/Reveal"
import GoToTop from "@/components/GoToTop"
import { email, socialLinks } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aakash Singh Rajput about a project, a job, training, or a question about blockchain and AI.",
  alternates: { canonical: "https://aakash4dev.com/contact" },
}

export default function ContactPage() {
  return (
    <main className="press-page press-container">
      <header className="press-page-heading">
        <p className="press-eyebrow">Contact</p>
        <h1>CONTACT ME<span className="press-red-period">.</span></h1>
        <p>Do you have a project, a job, or a question?<br className="hidden sm:block" /> Write to me here or send an email.</p>
      </header>

      <div className="press-contact-page">
        <Reveal from="left">
          <h2 className="press-contact-title">Send a message</h2>
          <ContactForm />
        </Reveal>

        <Reveal from="right" delay={0.1}>
          <h2 className="press-contact-title">Other ways to reach me</h2>
          <a href={`mailto:${email}`} className="press-contact-card"><Mail size={20} /><span><b>Email</b>{email}</span><ArrowUpRight size={18} /></a>
          <p className="press-contact-card"><MapPin size={20} /><span><b>Location</b>Noida, Uttar Pradesh, India</span></p>
          <div className="press-contact-list">{socialLinks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}<ArrowUpRight size={18} /></a>)}</div>
        </Reveal>
      </div>

      <Reveal className="press-next-links">
        <p className="press-eyebrow">Before you write</p>
        <div><Link href="/projects" className="press-text-link">See my projects <ArrowUpRight size={17} /></Link><Link href="/#services" className="press-text-link">See how I can help <ArrowUpRight size={17} /></Link><Link href="/blogs" className="press-text-link">Read my blog <ArrowUpRight size={17} /></Link></div>
      </Reveal>
      <GoToTop />
    </main>
  )
}
