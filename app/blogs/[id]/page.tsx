import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import GoToTop from "@/components/GoToTop"
import Reveal from "@/components/Reveal"
import { blogPosts } from "@/lib/blogs"
import { siteUrl } from "@/lib/site"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import type { Metadata } from "next"
import { articleSections } from "@/lib/headings"

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = blogPosts.find((entry) => entry.id === id)
  if (!post) return { title: "Article not found" }
  const url = `${siteUrl}/blogs/${post.id}`
  const socialImage = post.image.replace(/\.svg$/, ".png")
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords || post.tags,
    authors: [{ name: "Aakash Singh Rajput", url: siteUrl }],
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, type: "article", url, publishedTime: new Date(post.date).toISOString(), authors: ["Aakash Singh Rajput"], tags: post.tags, images: [{ url: socialImage, width: 1200, height: 630, alt: post.imageAlt || post.title }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [socialImage] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    notFound()
  }

  const position = blogPosts.indexOf(post)
  const previous = blogPosts[position - 1]
  const next = blogPosts[position + 1]
  const related = blogPosts.filter((entry) => entry.category === post.category && entry.id !== post.id)
  // Start after the current article so different articles suggest different reading.
  const start = related.length ? position % related.length : 0
  const suggestions = [...related.slice(start), ...related.slice(0, start)].slice(0, 3)
  if (suggestions.length < 3) suggestions.push(...blogPosts.filter((entry) => entry.id !== post.id && !suggestions.includes(entry)).slice(0, 3 - suggestions.length))
  const generatedCover = post.image.startsWith("/blogs/generated/")
  const sections = articleSections(post.content)
  const url = `${siteUrl}/blogs/${post.id}`
  const published = new Date(post.date).toISOString()
  // Structured data helps search engines show the article, its author, and its questions and answers.
  const structuredData: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: `${siteUrl}${post.image.replace(/\.svg$/, ".png")}`,
      datePublished: published,
      dateModified: published,
      mainEntityOfPage: url,
      keywords: (post.keywords || post.tags).join(", "),
      articleSection: post.category,
      author: { "@type": "Person", name: "Aakash Singh Rajput", url: siteUrl },
      publisher: { "@type": "Person", name: "Aakash Singh Rajput", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blogs` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ]
  if (post.faq?.length) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((entry) => ({ "@type": "Question", name: entry.question, acceptedAnswer: { "@type": "Answer", text: entry.answer } })),
    })
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="hover:text-primary">
            <Link href="/blogs" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all articles
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="rounded-none overflow-hidden">
          <div className="press-article-cover relative aspect-[1200/630] w-full overflow-hidden border-y border-foreground">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.imageAlt || `Illustration for: ${post.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className={generatedCover ? "object-cover" : "object-contain"}
              priority
            />
            <div className="absolute top-4 right-4 bg-foreground text-background text-xs font-semibold px-4 py-2">
              {post.category}
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-12 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
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
            {sections.length > 3 && (
              <nav aria-label="In this article" className="press-toc">
                <p className="press-eyebrow">In this article</p>
                <ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
              </nav>
            )}
            <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:gradient-text prose-a:text-primary hover:prose-a:underline prose-code:text-primary">
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
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/20 hover:text-primary hover:border-primary" asChild>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${post.title}" by @aakash4dev`)}&url=${encodeURIComponent(`${siteUrl}/blogs/${post.id}`)}`} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/20 hover:text-primary hover:border-primary" asChild>
                    <a href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/blogs/${post.id}`)}`} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Previous and next article */}
        <nav aria-label="More articles" className="press-article-nav">
          {previous ? <Link href={`/blogs/${previous.id}`}><span className="press-eyebrow"><ArrowLeft size={13} /> Previous article</span><b>{previous.title}</b></Link> : <span />}
          {next ? <Link href={`/blogs/${next.id}`} className="text-right"><span className="press-eyebrow justify-end">Next article <ArrowRight size={13} /></span><b>{next.title}</b></Link> : <span />}
        </nav>

        {/* Related articles */}
        <section className="mt-16" aria-labelledby="related-heading">
          <div className="press-section-heading"><div><p className="press-eyebrow">Keep reading</p><h2 id="related-heading">RELATED ARTICLES<span className="press-red-period">.</span></h2></div><Link href="/blogs" className="press-text-link">See all articles <ArrowRight size={17} /></Link></div>
          <div className="press-related">
            {suggestions.map((entry, index) => (
              <Reveal key={entry.id} delay={index * 0.08}>
                <Link href={`/blogs/${entry.id}`} className="press-related-card">
                  <span className="press-related-image"><Image src={entry.image} alt="" fill sizes="(max-width: 760px) 100vw, 320px" className="object-cover" /></span>
                  <span className="press-eyebrow">{entry.category}</span>
                  <b>{entry.title}</b>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
    <GoToTop />
    </>
  )
}
