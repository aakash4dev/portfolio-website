// Shown instantly when a visitor opens the blog or an article, while the page loads.
export default function Loading() {
  return (
    <main className="press-page press-container press-loading" aria-busy="true" aria-live="polite">
      <p className="press-eyebrow"><span className="press-square press-pulse" /> Opening article…</p>
      <div className="press-loading-title" />
      <div className="press-loading-title press-loading-short" />
      <div className="press-loading-lines">
        <span /><span /><span /><span className="press-loading-short" />
      </div>
    </main>
  )
}
