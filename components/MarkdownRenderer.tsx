"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import Image from "next/image"

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
                    // Override image rendering to use Next.js Image
                    img: ({ node, src, alt, ...props }) => {
                        if (!src) return null
                        return (
                            <div className="relative w-full h-64 md:h-96 my-8 rounded-xl overflow-hidden">
                                <Image
                                    src={src}
                                    alt={alt || "Blog Image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
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
