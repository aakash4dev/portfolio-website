import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MotionProvider from "@/components/site/MotionProvider"
import ScrollProgress from "@/components/ScrollProgress"
import { Analytics } from '@vercel/analytics/next';
import { siteUrl } from "@/lib/site"


// Poppins is used for all text: headings and body.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-body",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const description = "Aakash Singh Rajput is a Senior Blockchain & AI Engineer who builds smart contracts, ZK rollups, DeFi apps, AI agents, and developer tools. See projects, experience, and articles."
const title = "Aakash Singh Rajput | Senior Blockchain & AI Engineer"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Aakash Singh Rajput" },
  description,
  keywords: ["Aakash Singh Rajput", "aakash4dev", "Blockchain Engineer", "AI Engineer", "Smart Contracts", "Solidity", "Rust", "Cosmos SDK", "ZK Rollups", "DeFi", "AI Agents", "Web3 Developer India"],
  authors: [{ name: "Aakash Singh Rajput", url: siteUrl }],
  creator: "Aakash Singh Rajput",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title,
    description,
    siteName: "Aakash Singh Rajput",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aakash Singh Rajput, Blockchain and AI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aakash4dev",
    creator: "@aakash4dev",
    title,
    description,
    images: ["/og.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8813104713152167"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${poppins.variable} ${jetbrainsMono.variable} font-sans`}>
        <MotionProvider>
        <div className="site-shell">
          <a href="#main-content" className="press-skip-link">Skip to content</a>
          <ScrollProgress />
          <Navbar />
          <div id="main-content" tabIndex={-1}>{children}</div>
          <Footer />
          <Analytics />
        </div>
        </MotionProvider>
      </body>
    </html>
  )
}