# SEO Guide for Aakash's Portfolio

## Architecture
This project uses **Next.js 15 App Router** for SEO management.
- **Sitemap**: Generated dynamically at `https://aakash4dev.com/sitemap.xml` via `app/sitemap.ts`.
- **Robots**: Generated dynamically at `https://aakash4dev.com/robots.txt` via `app/robots.ts`.
- **Metadata**: Managed globally in `app/layout.tsx` and can be overridden in individual `page.tsx` files.

## How to Optimize Content

### 1. Adding New Pages
When you add a new page (e.g., `app/new-page/page.tsx`), you simply need to add it to the `routes` array in `app/sitemap.ts` to ensure Google indexes it.

```typescript
// app/sitemap.ts
const routes = [
  '',
  '/blogs',
  '/projects',
  '/new-page', // Add this
]
```

### 2. Adding New Blogs
Blogs are automatically added to the sitemap because `app/sitemap.ts` imports `blogPosts` from `lib/blogs.ts`.
**Action Required**: Just add your new blog post to the `blogPosts` array in `lib/blogs.ts`.

### 3. Customizing Page Metadata
For specific pages (like a specific project), you can export a `generateMetadata` function or a `metadata` object in that page's `page.tsx`.

```typescript
// app/projects/some-project/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Project Name | Aakash Singh Rajput",
  description: "Deep dive into this specific project...",
}
```

### 4. Improving Social Sharing (OpenGraph)
The default OpenGraph image is set in `app/layout.tsx`. To have a custom image for a blog post, ensure the `blogPost` object has a valid `image` property, and you can dynamically set it in `app/blogs/[id]/page.tsx` (already implemented if using standard Metadata API).

## Verification
You can verify the SEO setup by:
1. Visiting `https://aakash4dev.com/sitemap.xml` to see the generated XML.
2. Visiting `https://aakash4dev.com/robots.txt` to see crawler permissions.
3. Using tools like [OpenGraph.xyz](https://opengraph.xyz) to preview how your links look on Twitter/LinkedIn.
