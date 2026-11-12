"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Children, isValidElement, type ReactNode } from "react"
import CodeBlock from "@/components/CodeBlock"
import { headingId } from "@/lib/headings"

// Plain text of a heading, so it can get an id that the table of contents links to.
function textOf(node: ReactNode): string {
    return Children.toArray(node).map((child) => typeof child === "string" || typeof child === "number" ? String(child) : isValidElement(child) ? textOf((child.props as { children?: ReactNode }).children) : "").join("")
}

interface MarkdownRendererProps {
    content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg dark:prose-invert prose-headings:gradient-text prose-a:text-primary hover:prose-a:underline max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                    h2: ({ children }) => <h2 id={headingId(textOf(children))} className="scroll-mt-28">{children}</h2>,
                    table: ({ children }) => (
                        <div className="my-8 w-full overflow-x-auto"><table>{children}</table></div>
                    ),
                    // Preserve source charts in full; fixed-height cropping can hide axes and citations.
                    img: ({ node, src, alt, ...props }) => {
                        if (typeof src !== "string") return null
                        return (
                            <a href={src} target="_blank" rel="noopener noreferrer" className="my-6 block" aria-label={`Open full-size image: ${alt || "Article image"}`}>
                                <img src={src} alt={alt || "Article illustration"} loading="lazy" className={`m-0 h-auto max-h-none w-full rounded-none border border-border/50 object-contain`} />
                                <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{alt} · Open full size</span>
                            </a>
                        )
                    },
                    // Custom code block styling if needed (though prose handles it well usually)
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "")
                        // For inline code
                        if (!match) {
                            return (
                                <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono font-bold" {...props}>
                                    {children}
                                </code>
                            )
                        }
                        // For blocks, let prose handle it or customize further
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
