import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import DynamicBackground from "@/components/DynamicBackground"
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  description: "Portfolio of Aakash Singh Rajput, a Senior Blockchain Engineer & AI Developer specializing in Smart Contract Development, ZK-Sequencers, and DeFi Architecture.",
  keywords: ["Blockchain", "AI", "Smart Contracts", "ZK-Rollups", "DeFi", "Full Stack Developer", "Aakash Singh Rajput"],
  authors: [{ name: "Aakash Singh Rajput" }],
  creator: "Aakash Singh Rajput",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aakash4dev.com",
    title: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
    description: "Portfolio of Aakash Singh Rajput, a Senior Blockchain Engineer & AI Developer specializing in Smart Contract Development, ZK-Sequencers, and DeFi Architecture.",
    siteName: "Aakash Singh Rajput Portfolio",
    images: [
      {
        url: "/me_coding.png",
        width: 1200,
        height: 630,
        alt: "Aakash Singh Rajput Portfolio",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
    description: "Senior Blockchain Engineer & AI Developer specializing in Smart Contract Development, ZK-Sequencers, and DeFi Architecture.",
    images: ["/me_coding.png"],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8813104713152167"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
          <DynamicBackground />
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  )
}