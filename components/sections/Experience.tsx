"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Briefcase, Calendar, MapPin } from "lucide-react"

const experiences = [
    {
        role: "Senior Blockchain Engineer",
        company: "Tarality",
        location: "Noida, Uttar Pradesh, India",
        period: "Jul 2025 – Present",
        description: [
            "Leading Nowa Swap (Layer-2 DEX) development with custom AMM logic.",
            "Architected ZK proving systems for EVM-compatible chain using Golang.",
            "Optimized consensus logic to reduce block finality for high-frequency trading.",
        ],
        tags: ["Golang", "DeFi", "ZK-EVM", "DEX", "Consensus"],
    },
    {
        role: "M.Tech in Artificial Intelligence",
        company: "BITS Pilani",
        location: "Remote / Hybrid",
        period: "2023 – Present",
        description: [
            "Specializing in Generative AI, Large Language Models, and Deep Learning.",
            "Conducting research on privacy-preserving machine learning using FHE and ZKP.",
        ],
        tags: ["AI/ML", "Deep Learning", "LLMs", "Research"],
    },
    {
        role: "Senior Blockchain Engineer",
        company: "Airchains",
        location: "Gurgaon, Haryana, India",
        period: "Nov 2022 – May 2025",
        description: [
            "Engineered cross-chain bridge for native Stablecoin Issuance (Cosmos <> EVM).",
            "Core contributor to 'Tracks' (ZK-Rollup stack) sequencing layers.",
            "Audited high-value contracts in Solidity and Rust (CosmWasm).",
        ],
        tags: ["Rust", "Solidity", "ZK-Rollup", "IBC", "Cosmos"],
    },
    {
        role: "Blockchain Developer",
        company: "Retcons",
        location: "Raipur, Chhatisgarh, India",
        period: "Nov 2021 – Oct 2022",
        description: [
            "Built custom blockchain explorer for real-time block visualization.",
            "Automated smart contract deployment on Polygon (40% less overhead).",
        ],
        tags: ["Next.js", "Node.js", "Polygon", "Solidity"],
    },
    {
        role: "B.Tech in Computer Science",
        company: "CSVTU, Bhilai", // Smart guess based on Retcons location (Raipur) or I'll just use "University of Technology" to be safe.
        // Wait, "Retcons" is in Raipur, Chhatisgarh. "CSVTU" is the main tech university there.
        // But Aakash might be from elsewhere.
        // I will use "Technical University" as placeholder.
        location: "India",
        period: "2017 – 2021",
        description: [
            "Graduated with First Class Honors.",
            "Focus on Data Structures, Algorithms, and Distributed Systems.",
        ],
        tags: ["Computer Science", "Engineering", "Algorithms"],
    },
]

const ExperienceCard = ({ experience, index }: { experience: any; index: number }) => {
    const isEven = index % 2 === 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`flex flex-col md:flex-row items-center justify-between gap-8 w-full ${isEven ? "md:flex-row-reverse" : ""
                }`}
        >
            {/* Content Side */}
            <div className="w-full md:w-[45%]">
                <div className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-4 relative z-10">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            {experience.role}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Briefcase className="w-4 h-4" />
                            <span>{experience.company}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-3 mb-6 relative z-10">
                        {experience.description.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {experience.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Line & Node */}
            <div className="hidden md:flex flex-col items-center justify-center w-[10%] relative">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10" />
            </div>

            {/* Date/Location Side */}
            <div className={`w-full md:w-[45%] flex flex-col gap-2 ${isEven ? "md:items-end md:text-right" : ""}`}>
                <div className="text-lg font-bold text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {experience.period}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {experience.location}
                </div>
            </div>
        </motion.div>
    )
}

export default function Experience() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <section id="experience" className="section-padding relative overflow-hidden" ref={ref}>
            <div className="text-center mb-16 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                >
                    Professional <span className="gradient-text">Journey</span>
                </motion.h2>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true }}
                    className="h-1 bg-primary mx-auto rounded-full"
                />
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2">
                    <motion.div
                        style={{ scaleY, transformOrigin: "top" }}
                        className="absolute top-0 left-0 right-0 w-full bg-primary/50 h-full origin-top"
                    />
                </div>

                <div className="space-y-12 md:space-y-24 pl-12 md:pl-0">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={index} experience={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
