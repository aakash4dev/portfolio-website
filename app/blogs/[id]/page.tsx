import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { blogPosts } from "@/lib/blogs"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id.toString(),
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === parseInt(id))

  if (!post) {
    notFound()
  }

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
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
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.date}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="markdown-content space-y-4">
              {(() => {
                const lines = post.content.split("\n")
                const elements: JSX.Element[] = []
                let inCodeBlock = false
                let codeBlockContent: string[] = []
                let codeLanguage = ""
                let listItems: string[] = []
                let inList = false
                let keyCounter = 0

                const flushList = () => {
                  if (listItems.length > 0) {
                    elements.push(
                      <ul key={keyCounter++} className="list-disc list-inside space-y-2 mb-4 ml-4">
                        {listItems.map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">
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
                      <pre key={keyCounter++} className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                        <code className={`language-${codeLanguage}`}>
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

                  if (line.startsWith("# ")) {
                    elements.push(
                      <h1 key={keyCounter++} className="text-3xl font-bold mt-8 mb-4 gradient-text">
                        {line.substring(2)}
                      </h1>
                    )
                  } else if (line.startsWith("## ")) {
                    elements.push(
                      <h2 key={keyCounter++} className="text-2xl font-bold mt-6 mb-3">
                        {line.substring(3)}
                      </h2>
                    )
                  } else if (line.startsWith("### ")) {
                    elements.push(
                      <h3 key={keyCounter++} className="text-xl font-bold mt-4 mb-2">
                        {line.substring(4)}
                      </h3>
                    )
                  } else if (line.trim() === "") {
                    elements.push(<br key={keyCounter++} />)
                  } else {
                    const processedLine = line
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                    elements.push(
                      <p
                        key={keyCounter++}
                        className="mb-4 leading-relaxed text-muted-foreground"
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
        </div>
      </article>

      {/* Navigation */}
      <div className="mt-12 flex justify-center">
        <Button asChild>
          <Link href="/blogs">View All Blogs</Link>
        </Button>
      </div>
    </main>
  )
}
