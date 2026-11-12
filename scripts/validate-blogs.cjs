// Checks every article before publishing. Run with: npm run blogs:check
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const { blogPosts } = require("./blog-library.cjs")
const root = path.join(__dirname, "..")
const articles = blogPosts.filter((post) => post.image.startsWith("/blogs/generated/"))
const ids = new Set(blogPosts.map((post) => post.id))

assert.equal(ids.size, blogPosts.length, "Every article needs its own URL")
let snippets = 0
let minWords = Infinity
let totalWords = 0
for (const post of blogPosts) {
  assert.match(post.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `URL-safe slug: ${post.id}`)
  assert.ok(Number.isFinite(new Date(post.date).getTime()), `Valid date: ${post.id}`)
  assert.ok(fs.existsSync(path.join(root, "public", post.image)), `Cover exists: ${post.id}`)
  for (const match of post.content.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)) assert.ok(fs.existsSync(path.join(root, "public", match[1])), `Inline image exists: ${match[1]}`)
  // Links to other articles on this site must point to an article that exists.
  for (const match of post.content.matchAll(/\]\(\/blogs\/([^)#]+)\)/g)) assert.ok(ids.has(match[1]), `Broken link in ${post.id}: /blogs/${match[1]}`)
  if (!articles.includes(post)) continue

  assert.ok(fs.existsSync(path.join(root, "public", post.image.replace(/\.svg$/, ".png"))), `Social preview exists: ${post.id}`)
  assert.ok(post.title.length <= 70, `Title fits in search results (${post.title.length} characters): ${post.id}`)
  assert.ok(post.excerpt.length >= 70 && post.excerpt.length <= 165, `Description length (${post.excerpt.length} characters): ${post.id}`)
  assert.equal((post.content.match(/^```/gm) || []).length % 2, 0, `Closed code fences: ${post.id}`)
  const prose = post.content.replace(/```[\s\S]*?```/g, "")
  const words = prose.trim().split(/\s+/).length
  minWords = Math.min(minWords, words)
  totalWords += words
  assert.ok(words >= 600, `Enough depth (${words} words): ${post.id}`)
  assert.ok((prose.match(/^## /gm) || []).length >= 4, `At least four sections: ${post.id}`)
  assert.ok(post.faq && post.faq.length >= 3, `At least three FAQ answers: ${post.id}`)
  assert.ok((post.content.match(/\]\(\/blogs\//g) || []).length >= 2, `Links to at least two other articles: ${post.id}`)
  // A dollar sign outside code would be read as a math formula by the page renderer.
  assert.ok(!prose.replace(/`[^`\n]*`/g, "").includes("$"), `Dollar sign outside code: ${post.id}`)
  assert.ok(!/TODO:|lorem ipsum|insert (?:image|code) here/.test(post.content), `No placeholders: ${post.id}`)
  snippets += (post.content.match(/^```[a-zA-Z]/gm) || []).length
}
const perCategory = [...new Set(articles.map((post) => post.category))].map((category) => `${articles.filter((post) => post.category === category).length} ${category}`).join(", ")
console.log(`Validated ${blogPosts.length} articles (${perCategory}, ${blogPosts.length - articles.length} older). ${snippets} code examples. Shortest article: ${minWords} words. Average: ${Math.round(totalWords / Math.max(articles.length, 1))} words.`)
