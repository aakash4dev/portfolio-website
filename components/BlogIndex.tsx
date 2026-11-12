"use client"

import { useState } from "react"
import type { BlogSummary } from "@/lib/blog-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, Search, Calendar, User, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import TiltCard from "@/components/ui/TiltCard"
import Reveal from "@/components/Reveal"

const PAGE_SIZE = 12

export default function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const categories = ["All", ...new Set(posts.map((post) => post.category))]
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter blog posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : new Date(b.date).getTime() - new Date(a.date).getTime())
  const pageCount = Math.ceil(filteredPosts.length / PAGE_SIZE)
  const visiblePosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function changePage(next: number) {
    setPage(next)
    document.getElementById("article-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="press-page press-container">
      <header className="press-page-heading">
        <p className="press-eyebrow">Blog</p>
        <h1>MY BLOG<span className="press-red-period">.</span></h1>
        <p>Clear guides to AI, blockchain, and coding.<br className="hidden sm:block" /> Each one answers a common question, with code examples you can copy.</p>
      </header>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            aria-label="Search articles"
            placeholder="Search articles by topic or tag..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
          />
        </div>

        <fieldset aria-label="Article categories" className="flex w-full flex-wrap gap-2">
            {categories.map((category) => (
              <button type="button" key={category} aria-pressed={selectedCategory === category} onClick={() => { setSelectedCategory(category); setPage(1) }} className={`rounded-none border px-3 py-2 text-xs md:text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selectedCategory === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                {category} <span className="ml-1 opacity-60">{category === "All" ? posts.length : posts.filter((post) => post.category === category).length}</span>
              </button>
            ))}
        </fieldset>
      </div>

      <div id="article-results" className="mb-6 flex flex-wrap items-center justify-between gap-4 scroll-mt-24">
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {filteredPosts.length === 0 ? "0 articles" : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredPosts.length)} of ${filteredPosts.length} articles`}
        </p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">Sort by
          <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }} className="rounded-md border border-border bg-background px-3 py-2 text-foreground">
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>
      {/* Blog Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post, index) => (
            <Reveal key={post.id} delay={(index % 3) * 0.08} className="h-full">
            <Link href={`/blogs/${post.id}`} className="group h-full block">
              <TiltCard className="rounded-none overflow-hidden h-full glass" glareColor="rgba(255, 255, 255, 0.15)">
                <div className="flex flex-col h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.imageAlt || `Illustration for: ${post.title}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-foreground text-background text-xs font-medium px-2 py-1">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-extrabold tracking-tight mb-2 group-hover:text-primary transition-colors">{post.title}</h2>

                    <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-none bg-secondary/60 text-primary flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No articles match your search.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchQuery("")
            setSelectedCategory("All")
            setPage(1)
          }}>
            Clear search
          </Button>
        </div>
      )}
      {pageCount > 1 && (
        <nav aria-label="Article pagination" className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" disabled={page === 1} onClick={() => changePage(page - 1)}>Previous</Button>
          <span className="px-3 text-sm text-muted-foreground" aria-current="page">Page {page} of {pageCount}</span>
          <Button variant="outline" disabled={page === pageCount} onClick={() => changePage(page + 1)}>Next</Button>
        </nav>
      )}
      <Reveal className="press-next-links"><p className="press-eyebrow">What next?</p><div><Link href="/tutorials" className="press-text-link">Watch my tutorials <ArrowUpRight size={17} /></Link><Link href="/projects" className="press-text-link">See my projects <ArrowUpRight size={17} /></Link><Link href="/contact" className="press-text-link">Contact me <ArrowUpRight size={17} /></Link></div></Reveal>
    </main>
  )
}
