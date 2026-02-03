import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react"
import { blogPosts } from "@/lib/blogs"
import MarkdownRenderer from "@/components/MarkdownRenderer"

// Calculate estimated reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

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
    <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="hover:text-primary">
            <Link href="/blogs" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="glass rounded-2xl overflow-hidden">
          <div className="relative h-64 md:h-[450px] w-full overflow-hidden bg-gradient-to-b from-primary/20 to-background">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-semibold px-4 py-2 rounded-full">
              {post.category}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground border-b border-border/50 pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {calculateReadingTime(post.content)} min read
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none prose-lg prose-headings:gradient-text prose-a:text-primary hover:prose-a:underline prose-code:text-primary prose-pre:bg-black/40 prose-pre:border prose-pre:border-border/50">
              <div className="markdown-content space-y-6 leading-relaxed">
                <MarkdownRenderer content={post.content} />
              </div>
            </div>

            {/* Tags & Share */}
            <div className="mt-16 pt-8 border-t border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground flex items-center hover:bg-primary/20 hover:text-primary transition-colors cursor-default border border-border/30"
                    >
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-sm font-semibold text-muted-foreground">Share:</span>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-400" asChild>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${post.title}" by @aakash4dev`)}&url=https://aakash4dev.com/blogs/${post.id}`} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-400" asChild>
                    <a href={`https://linkedin.com/sharing/share-offsite/?url=https://aakash4dev.com/blogs/${post.id}`} target="_blank" rel="noopener noreferrer">
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
      </div>
    </main>
  )
}
