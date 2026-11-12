import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import Reveal from "@/components/Reveal"

export default function About() {
  return (
    <section id="about" className="section-padding press-about">
      <Reveal className="press-about-photo" from="left"><Image src="/me_coding.png" alt="Aakash Singh Rajput working on a laptop" width={700} height={800} sizes="(max-width: 760px) 100vw, 40vw" className="h-full w-full object-cover" /><span>Aakash Singh Rajput</span></Reveal>
      <Reveal className="press-about-copy" from="right" delay={0.1}>
        <p className="press-eyebrow">About me</p>
        <h2>HI, I'M AAKASH.<br />BLOCKCHAIN AND AI ENGINEER<span className="press-red-period">.</span></h2>
        <p>I'm Aakash Singh Rajput, a Senior Blockchain Engineer. I work on smart contracts, blockchain networks, and artificial intelligence.</p>
        <p>I write smart contracts in Solidity and Rust. I have built Cosmos SDK blockchains, DeFi apps, and ZK rollup software. I'm also studying for an M.Tech in Artificial Intelligence at BITS Pilani.</p>
        <p>I like to learn how hard systems work, build useful things with them, and explain them in simple words.</p>
        <div className="press-about-links"><a href="https://github.com/aakash4dev" target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a><a href="https://linkedin.com/in/aakash4dev" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a><Link href="/contact"><Mail size={17} /> Contact me <ArrowUpRight size={14} /></Link></div>
      </Reveal>
    </section>
  )
}
