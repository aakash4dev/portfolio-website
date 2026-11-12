// Turns a heading into the id used for links inside an article, for example "What is RAG?" -> "what-is-rag".
export function headingId(text: string): string {
  return text.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

// The main sections (## headings) of a Markdown article, skipping anything inside code blocks.
export function articleSections(content: string): { id: string; title: string }[] {
  const prose = content.replace(/```[\s\S]*?```/g, "")
  return [...prose.matchAll(/^## (.+)$/gm)].map((match) => {
    const title = match[1].replace(/[`*_]/g, "").trim()
    return { id: headingId(title), title }
  })
}
