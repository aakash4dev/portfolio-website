"use client"

import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"

export default function CodeBlock({ children }: { children: ReactNode }) {
  const pre = useRef<HTMLPreElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const code = Children.toArray(children).find(isValidElement)
  const className = code ? (code.props as { className?: string }).className : undefined
  const language = /language-([^\s]+)/.exec(className || "")?.[1] || "Code"

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function copy() {
    const text = pre.current?.textContent
    if (text === undefined || text === null) return
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const selection = document.createElement("textarea")
        selection.value = text
        selection.style.position = "fixed"
        selection.style.opacity = "0"
        document.body.appendChild(selection)
        selection.select()
        let copied = false
        try { copied = document.execCommand("copy") } finally { selection.remove() }
        if (!copied) throw new Error("Clipboard unavailable")
      }
      setStatus("copied")
    } catch {
      setStatus("error")
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <div className="not-prose my-7 min-w-0 overflow-hidden rounded-none border border-foreground bg-[#161616] text-stone-100">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="text-xs font-mono text-stone-300">{language}</span>
        <button type="button" onClick={copy} aria-label={`Copy ${language} code`} className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-xs font-medium text-stone-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          {status === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {status === "copied" ? "Copied!" : "Copy code"}
        </button>
      </div>
      <pre ref={pre} tabIndex={0} aria-label={`${language} code example`} className="m-0 overflow-x-auto bg-transparent p-5 text-sm leading-7 [&>code]:bg-transparent [&>code]:p-0 [&>code]:font-normal [&>code]:text-stone-100">{children}</pre>
      <span role="status" aria-live="polite" className={status === "error" ? "block px-4 pb-3 text-xs text-amber-300" : "sr-only"}>
        {status === "copied" ? "Code copied to clipboard." : status === "error" ? "Copy failed. Select the code and copy it manually." : ""}
      </span>
    </div>
  )
}
