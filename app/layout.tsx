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

export const metadata: Metadata = {
  metadataBase: new URL('https://aakash4dev.com'),
  title: {
    default: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
    template: "%s | Aakash Singh Rajput"
  },
  description: "Portfolio of Aakash Singh Rajput, a Senior Blockchain Engineer & AI Developer who builds smart contracts, ZK rollups, and DeFi apps.",
  keywords: ["Blockchain", "AI", "Smart Contracts", "ZK-Rollups", "DeFi", "Full Stack Developer", "Aakash Singh Rajput"],
  authors: [{ name: "Aakash Singh Rajput" }],
  creator: "Aakash Singh Rajput",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aakash4dev.com",
    title: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
    description: "Portfolio of Aakash Singh Rajput, a Senior Blockchain Engineer & AI Developer who builds smart contracts, ZK rollups, and DeFi apps.",
    siteName: "Aakash Singh Rajput Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Aakash Singh Rajput — AI and Web3 Engineer",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
    description: "Senior Blockchain Engineer & AI Developer who builds smart contracts, ZK rollups, and DeFi apps.",
    images: ["/og.png"],
  },
  generator: 'v0.dev'
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