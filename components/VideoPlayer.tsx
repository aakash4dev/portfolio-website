"use client"

import { useState } from "react"
import { Play } from "lucide-react"

// Shows the video picture first. The YouTube player loads only after a click, so the page stays fast.
export default function VideoPlayer({ embedId, title }: { embedId: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return <div className="press-video-frame"><iframe src={`https://www.youtube.com/embed/${embedId}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
  }
  return (
    <button type="button" className="press-video-frame" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${embedId}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className="press-video-play"><Play size={30} fill="currentColor" /></span>
    </button>
  )
}
