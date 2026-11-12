import type { Metadata } from "next"
import ProjectLibrary from "@/components/site/ProjectLibrary"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Projects",
  description: "Products and open-source software by Aakash Singh Rajput: AI tools like AIPrompts.page, developer tools like TheDevKits, and blockchain projects in Solidity, Rust, and Go.",
  alternates: { canonical: `${siteUrl}/projects` },
}

export default function ProjectsPage() { return <ProjectLibrary /> }
