"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Youtube } from "lucide-react"
import VideoPlayer from "@/components/VideoPlayer"
import { channelUrl, youtubeVideos } from "@/lib/tutorials"

const tabs = [
  { id: "youtube", label: "YouTube videos", icon: Youtube, status: `${youtubeVideos.length} ${youtubeVideos.length === 1 ? "video" : "videos"}` },
  { id: "udemy", label: "Udemy courses", icon: BookOpen, status: "Coming soon" },
  { id: "docs", label: "Docs", icon: FileText, status: "Coming soon" },
]

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState("youtube")

  return (
    <main className="press-page press-container">
      <header className="press-page-heading"><p className="press-eyebrow">Tutorials</p><h1>TUTORIALS<span className="press-red-period">.</span></h1><p>Step-by-step videos and learning material.<br className="hidden sm:block" /> Choose a type below.</p></header>

      <div className="press-tabs" role="tablist" aria-label="Tutorial types">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          return (
            <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-selected={selected} aria-controls="tutorial-panel" className="press-tab" onClick={() => setActiveTab(tab.id)}>
              {selected && <motion.span layoutId="press-tab-active" className="press-tab-active" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
              <span className="press-tab-number">0{index + 1}</span>
              <Icon size={22} />
              <span className="press-tab-label">{tab.label}<small>{tab.status}</small></span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} id="tutorial-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          {activeTab === "youtube" && (
            <>
              {youtubeVideos.map((video, index) => (
                <article key={video.embedId} className="press-video">
                  <VideoPlayer embedId={video.embedId} title={video.title} />
                  <div className="press-video-copy">
                    <p className="press-eyebrow">Video {String(index + 1).padStart(2, "0")} / YouTube</p>
                    <h2>{video.title}</h2>
                    <p>{video.description}</p>
                    <div className="press-project-tags">{video.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <a href={`https://www.youtube.com/watch?v=${video.embedId}`} target="_blank" rel="noopener noreferrer" className="press-button">Watch on YouTube <ArrowRight size={17} /></a>
                  </div>
                </article>
              ))}
              <div className="press-channel"><Youtube size={30} /><p><b>More videos are on my YouTube channel.</b>Subscribe to see new tutorials when I post them.</p><a href={channelUrl} target="_blank" rel="noopener noreferrer" className="press-button press-button-light">Open my channel <ArrowUpRight size={17} /></a></div>
            </>
          )}

          {activeTab === "udemy" && (
            <div className="press-soon">
              <span className="press-soon-icon"><BookOpen size={34} /></span>
              <div>
                <p className="press-eyebrow">Udemy courses / Coming soon</p>
                <h2>Courses are not ready yet.</h2>
                <p>I'm making courses on blockchain and AI development. They will be listed here when they are ready.</p>
                <div className="press-soon-links"><button type="button" className="press-text-link" onClick={() => setActiveTab("youtube")}>Watch my YouTube videos <ArrowUpRight size={17} /></button><Link href="/contact" className="press-text-link">Ask me about training <ArrowUpRight size={17} /></Link></div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="press-soon">
              <span className="press-soon-icon"><FileText size={34} /></span>
              <div>
                <p className="press-eyebrow">Docs / Coming soon</p>
                <h2>Guides are not ready yet.</h2>
                <p>I'm writing guides for developers. Until then, you can read the articles on my blog.</p>
                <div className="press-soon-links"><Link href="/blogs" className="press-text-link">Read my blog <ArrowUpRight size={17} /></Link><button type="button" className="press-text-link" onClick={() => setActiveTab("youtube")}>Watch my YouTube videos <ArrowUpRight size={17} /></button></div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="press-next-links"><p className="press-eyebrow">What next?</p><div><Link href="/blogs" className="press-text-link">Read my blog <ArrowUpRight size={17} /></Link><Link href="/projects" className="press-text-link">See my projects <ArrowUpRight size={17} /></Link><Link href="/contact" className="press-text-link">Contact me <ArrowUpRight size={17} /></Link></div></div>
    </main>
  )
}
