# Portfolio Website

Its for my profile website.

A modern portfolio website built with Next.js, featuring interactive 3D elements, smooth animations, and a responsive design.

## Tech Stack

- Next.js 15 (App Router)
- React Three Fiber / Three.js
- Tailwind CSS
- Framer Motion
- Shadcn UI
- TypeScript

## Getting Started

```bash
git clone https://github.com/aakash4dev/portfolio-website.git
cd portfolio-website
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
portfolio-website/
  app/           # Next.js pages and routes
  components/    # React components
  lib/           # Utilities
  public/        # Static assets
```

## Blog library

The site uses a paper-white design with black headings, red accents, and CSS 3D cards on the homepage. The homepage layers respond to pointer movement, scroll, and an explicit unfold control. Motion respects the visitor's reduced-motion setting. Theme rules live in `app/globals.css`; the homepage scene is in `components/sections/Hero.tsx`.

Run `npm run site:check` to check the theme's pages and shared components. This focused configuration excludes the older playground's unrelated type errors. Project data is shared through `lib/projects.ts`.

The five original articles are retained in `lib/blogs.ts`. An additional 100 articles live in `lib/content/`: 20 each for AI, Web3, programming, hosting, and tools. Each article includes linked primary sources, a topic-specific diagram, and implementation examples where appropriate.

```bash
npm run blogs:covers # regenerate SVG covers and PNG social previews
npm run blogs:check  # validate content/assets and type-check the blog feature
npm run build
```

The listing passes only summaries to the client and displays 12 results per page. Markdown code fences automatically receive a copy button. Use a language identifier after the opening fence to label the snippet.

Comparison articles include interactive chart/table views and CSV export. Survey usage and Arena preference ratings measure different things; neither is presented as a universal runtime or coding benchmark. Measurements are dated snapshots, not live rankings.

The language-comparison article also includes a real local Node.js/CPython NDJSON experiment, its raw timings, and its limitations. Reproduce it with `python3 scripts/benchmarks/run-language-benchmark.py` (requires matplotlib, Python, and Node). The article reads its result summary from the saved JSON; rerunning the experiment replaces the JSON, CSV and chart, so rebuild afterwards to publish the new measurements.

`public/blogs/evidence/` contains the original Stack Overflow 2025 language chart, Stanford's original 2026 Arena chart, and a screenshot rendered from page 78 of Stanford's technical-performance report. Sources, dates, attribution, and the five built-in ImageGen illustration briefs are recorded in `public/blogs/asset-provenance.json`. The SVG/PNG covers are locally rendered conceptual diagrams; generated illustrations are labelled separately from evidence.

For a new article, add its metadata and Markdown to the relevant category module, supply three short conceptual `diagram` stages, then regenerate the covers. `app/sitemap.ts` automatically includes every article route.

## License

MIT

## Blog articles

The 100 researched articles are Markdown files in `content/blog/<category>/`. After adding or editing one, run:

```bash
npm run blogs:build
```

This builds `lib/content/articles.ts`, draws the cover images, and checks every article. How the topics were chosen is described in `docs/blog-research.md`.
