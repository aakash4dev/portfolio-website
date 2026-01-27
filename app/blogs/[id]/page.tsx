import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { blogPosts } from "@/lib/blogs"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    notFound()
  }

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/blogs" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="glass rounded-xl overflow-hidden">
        <div className="relative h-64 md:h-[400px] w-full overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 gradient-text leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground border-b border-border/50 pb-8">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium text-foreground">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {post.date}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none prose-lg prose-headings:gradient-text prose-a:text-primary hover:prose-a:underline">
            <div className="markdown-content space-y-6">
              {(() => {
                const lines = post.content.split("\n")
                const elements: any[] = []
                let inCodeBlock = false
                let codeBlockContent: string[] = []
                let codeLanguage = ""
                let listItems: string[] = []
                let inList = false
                let keyCounter = 0

                const flushList = () => {
                  if (listItems.length > 0) {
                    elements.push(
                      <ul key={keyCounter++} className="list-disc list-inside space-y-2 mb-6 ml-4">
                        {listItems.map((item, idx) => (
                          <li key={idx} className="text-muted-foreground/90">
                            {item.replace(/^[-*]\s+/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
                          </li>
                        ))}
                      </ul>
                    )
                    listItems = []
                    inList = false
                  }
                }

                const flushCodeBlock = () => {
                  if (codeBlockContent.length > 0) {
                    elements.push(
                      <pre key={keyCounter++} className="bg-muted/50 border border-white/5 p-4 rounded-xl overflow-x-auto mb-6">
                        <code className={`language-${codeLanguage} text-sm`}>
                          {codeBlockContent.join("\n")}
                        </code>
                      </pre>
                    )
                    codeBlockContent = []
                    codeLanguage = ""
                  }
                }

                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i]

                  if (line.startsWith("```")) {
                    if (inCodeBlock) {
                      flushCodeBlock()
                      inCodeBlock = false
                    } else {
                      flushList()
                      inCodeBlock = true
                      codeLanguage = line.substring(3).trim() || "text"
                    }
                    continue
                  }

                  if (inCodeBlock) {
                    codeBlockContent.push(line)
                    continue
                  }

                  if (line.match(/^[-*]\s+/)) {
                    if (!inList) {
                      flushList()
                      inList = true
                    }
                    listItems.push(line)
                    continue
                  } else {
                    flushList()
                  }

                  // Skip H1 (Title) to avoid duplication
                  if (line.startsWith("# ")) {
                    continue
                  }

                  if (line.startsWith("## ")) {
                    elements.push(
                      <h2 key={keyCounter++} className="text-2xl font-bold mt-10 mb-4 text-foreground/90">
                        {line.substring(3)}
                      </h2>
                    )
                  } else if (line.startsWith("### ")) {
                    elements.push(
                      <h3 key={keyCounter++} className="text-xl font-bold mt-8 mb-3 text-foreground/80">
                        {line.substring(4)}
                      </h3>
                    )
                  } else if (line.trim() === "") {
                    // Reduce multiple newlines
                  } else {
                    const processedLine = line
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>")
                      .replace(/`(.*?)`/g, '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
                    elements.push(
                      <p
                        key={keyCounter++}
                        className="mb-6 leading-7 text-muted-foreground/90 text-lg"
                        dangerouslySetInnerHTML={{ __html: processedLine }}
                      />
                    )
                  }
                }

                flushList()
                flushCodeBlock()

                return elements
              })()}
            </div>
          </div>

          {/* Tags & Share */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-4 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground flex items-center hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                  >
                    <Tag className="h-3.5 w-3.5 mr-2" />
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Share:</span>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://aakash.dev/blogs/${post.id}`} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
                  <a href={`https://linkedin.com/shareArticle?mini=true&url=https://aakash.dev/blogs/${post.id}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                  </a>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Navigation */}
      <div className="mt-12 flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/blogs">View All Blogs</Link>
        </Button>
      </div>
    </main>
  )
}
