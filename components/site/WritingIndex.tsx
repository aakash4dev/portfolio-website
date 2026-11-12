import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { blogPosts } from "@/lib/blogs"
import Reveal from "@/components/Reveal"

export default function WritingIndex() {
  const articles = ["what-is-rag", "what-is-blockchain", "what-are-ai-agents"].map((id) => blogPosts.find((post) => post.id === id)!)
  return (
    <section id="blog" className="press-writing press-container">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Writing</p><h2>MY ARTICLES<span className="press-red-period">.</span></h2></div><Link href="/blogs" className="press-text-link">See all {blogPosts.length} articles <ArrowUpRight size={17} /></Link></Reveal>
      <div>{articles.map((article, index) => <Reveal key={article.id} delay={index * 0.08}><Link href={`/blogs/${article.id}`} className="press-writing-row"><span className="press-project-number">{String(index + 1).padStart(2, "0")}</span><span className="press-eyebrow">{article.category}</span><h3>{article.title}</h3><ArrowUpRight size={22} /></Link></Reveal>)}</div>
    </section>
  )
}
