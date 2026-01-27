import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import DynamicBackground from "@/components/DynamicBackground"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Aakash Singh Rajput | Senior Blockchain Engineer & AI Developer",
  description:
    "Portfolio of Aakash Singh Rajput, a Senior Blockchain Engineer & AI Developer specializing in Smart Contract Development, ZK-Sequencers, and DeFi Architecture.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
          <DynamicBackground />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}



import './globals.css'