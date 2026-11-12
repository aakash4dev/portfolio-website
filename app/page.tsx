import type { Metadata } from "next"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Experience from "@/components/sections/Experience"
import Education from "@/components/sections/Education"
import Projects from "@/components/sections/Projects"
import WhatIOffer from "@/components/sections/WhatIOffer"
import Tutorials from "@/components/sections/Tutorials"
import WritingIndex from "@/components/site/WritingIndex"
import GoToTop from "@/components/GoToTop"
import { email, siteUrl, socialLinks } from "@/lib/site"

export const metadata: Metadata = { alternates: { canonical: "/" } }

// Tells Google who this site is about, so searches for the name can show a profile result.
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Aakash Singh Rajput",
    alternateName: "aakash4dev",
    url: siteUrl,
    image: `${siteUrl}/me_coding.png`,
    email: `mailto:${email}`,
    jobTitle: "Senior Blockchain Engineer",
    description: "Blockchain and AI engineer who builds smart contracts, ZK rollups, DeFi apps, AI agents, and developer tools.",
    worksFor: { "@type": "Organization", name: "Tarality" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "BITS Pilani" },
      { "@type": "CollegeOrUniversity", name: "Rungta College of Engineering and Technology" },
    ],
    address: { "@type": "PostalAddress", addressLocality: "Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    knowsAbout: ["Blockchain", "Smart contracts", "Solidity", "Rust", "Go", "Cosmos SDK", "Zero-knowledge proofs", "ZK rollups", "DeFi", "Artificial intelligence", "Large language models", "AI agents"],
    sameAs: socialLinks.filter(([name]) => name !== "Buy me a coffee").map(([, href]) => href),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Aakash Singh Rajput",
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#person` },
  },
]

export default function Home() {
  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Education />
      <Skills />
      <WritingIndex />
      <Tutorials />
      <WhatIOffer />
      <GoToTop />
    </main>
  )
}

