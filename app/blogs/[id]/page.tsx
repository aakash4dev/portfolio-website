import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { blogPosts } from "@/lib/blogs"
import MarkdownRenderer from "@/components/MarkdownRenderer"

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
              <MarkdownRenderer content={post.content} />
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
