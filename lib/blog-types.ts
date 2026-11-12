export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  image: string
  imageAlt?: string
  tags: string[]
  /** Search phrases this article answers. Used in the page metadata. */
  keywords?: string[]
  /** Scene for the generated cover image, for example "flow files search-check message-square-quote". */
  cover?: string
  /** Questions and answers from the article's FAQ section. Sent to search engines as structured data. */
  faq?: { question: string; answer: string }[]
  content: string
}

export type BlogSummary = Omit<BlogPost, "content" | "cover" | "faq" | "keywords">
