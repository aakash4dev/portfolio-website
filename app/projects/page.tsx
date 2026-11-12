import type { Metadata } from "next"
import ProjectLibrary from "@/components/site/ProjectLibrary"

export const metadata: Metadata = { title: "Projects", description: "Developer tools, AI apps, and blockchain software built by Aakash Singh Rajput.", alternates: { canonical: "https://aakash4dev.com/projects" } }

export default function ProjectsPage() { return <ProjectLibrary /> }
