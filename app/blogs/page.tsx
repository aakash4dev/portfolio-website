import type { Metadata } from "next"
import BlogIndex from "@/components/BlogIndex"
import { blogPosts } from "@/lib/blogs"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "AI, Blockchain & Coding Blog",
  description: "Clear guides to AI, blockchain, and coding. Each article answers a common question, with examples and code you can copy.",
  alternates: { canonical: `${siteUrl}/blogs` },
}

export default function BlogsPage() {
  // Send only listing metadata to the browser, not the entire article library.
  const posts = blogPosts.map(({ content, cover, faq, keywords, ...summary }) => summary)
  return <BlogIndex posts={posts} />
}
