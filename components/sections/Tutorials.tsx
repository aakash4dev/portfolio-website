import Link from "next/link"
import { ArrowUpRight, Youtube } from "lucide-react"
import { channelUrl, youtubeVideos } from "@/lib/tutorials"
import VideoPlayer from "@/components/VideoPlayer"
import Reveal from "@/components/Reveal"

export default function Tutorials() {
  const video = youtubeVideos[0]
  return (
    <section id="tutorials" className="section-padding press-home-tutorials">
      <Reveal className="press-section-heading"><div><p className="press-eyebrow">Tutorials</p><h2>I ALSO TEACH<span className="press-red-period">.</span></h2></div><Link href="/tutorials" className="press-text-link">See all tutorials <ArrowUpRight size={17} /></Link></Reveal>
      <Reveal as="article" className="press-video">
        <VideoPlayer embedId={video.embedId} title={video.title} />
        <div className="press-video-copy">
          <p className="press-eyebrow">Latest video / YouTube</p>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="press-button"><Youtube size={17} /> Visit my YouTube channel <ArrowUpRight size={17} /></a>
        </div>
      </Reveal>
    </section>
  )
}
