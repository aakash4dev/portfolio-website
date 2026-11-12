import type { Metadata } from "next"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tutorials",
  description: "Step-by-step video tutorials by Aakash Singh Rajput on developer tools, AI, and blockchain, with more courses and guides coming.",
  alternates: { canonical: `${siteUrl}/tutorials` },
}

export default function TutorialsLayout({ children }: { children: React.ReactNode }) {
  return children
}
