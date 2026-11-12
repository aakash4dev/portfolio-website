export interface PortfolioProject {
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo: string
}

export const personalProjects: PortfolioProject[] = [
  {
    title: "AIPrompts.page",
    description: "A free library of tested AI prompts for images, videos, writing, and code. Copy a prompt for ChatGPT, Gemini, or Midjourney, or run it on the site.",
    image: "/projects/aiprompts.png",
    tags: ["AI", "Prompts", "ChatGPT", "Midjourney"],
    github: "",
    demo: "https://aiprompts.page",
  },
  {
    title: "TheDevKits.com",
    description: "A website with free tools, templates, and resources that help developers work faster.",
    image: "/projects/thedevkits.png",
    tags: ["Next.js", "React", "TailwindCSS", "Tools"],
    github: "",
    demo: "https://thedevkits.com",
  },
  {
    title: "Medisence AI",
    description: "A medical assistant that uses AI language models to answer health questions and suggest possible causes. Recognised by Commudle.",
    image: "/projects/medisence.png",
    tags: ["AI", "LLM", "Python", "Healthcare"],
    github: "https://github.com/aakash4dev/medisence-ai",
    demo: "",
  },
  {
    title: "VRF Chain",
    description: "A blockchain that creates random numbers anyone can check, so results are fair and cannot be faked.",
    image: "/projects/vrfchain.png",
    tags: ["Blockchain", "VRF", "Cryptography", "Solidity"],
    github: "https://github.com/aakash4dev/vrfchain",
    demo: "",
  },
  {
    title: "MarketCompassZ",
    description: "A tool that shows prices and trends for crypto and financial markets in charts.",
    image: "/projects/marketcompassz.png",
    tags: ["Finance", "Data Viz", "API", "React"],
    github: "https://github.com/aakash4dev/MarketCompassZ",
    demo: "",
  },
  {
    title: "Next.js Ethereum Explorer",
    description: "A small website to search blocks, transactions, and addresses on Ethereum networks. Built with Next.js.",
    image: "/projects/explorer.png",
    tags: ["Next.js", "Ethers.js", "Blockchain", "Explorer"],
    github: "https://github.com/aakash4dev/nextjs-ethereum-explorer",
    demo: "https://nextjs-ethereum-explorer.vercel.app/",
  },
]

export const contributions = [
  {
    title: "ZK-EVM Prover",
    company: "Tarality",
    description:
      "Built a zero-knowledge prover for an EVM chain. It proves that transactions are correct without showing user data.",
    tags: ["Go", "ZK-EVM", "Privacy", "Cryptography"],
  },
  {
    title: "Nowa Swap (L2 DEX)",
    company: "Tarality",
    description:
      "Worked on the backend and smart contracts of a token swap app on ZK-EVM. Added special pools for stablecoins so users lose less money on each trade.",
    tags: ["Solidity", "DeFi", "DEX", "AMM"],
  },
  {
    title: "ZK-Sequencer (Tracks)",
    company: "Airchains",
    description:
      "Main contributor to Tracks, a ZK rollup toolkit. Designed the part that orders transactions and made proof creation faster, using Rust.",
    tags: ["Rust", "ZK-Rollup", "Sequencer", "Blockchain"],
  },
  {
    title: "Junction (Blockchain)",
    company: "Airchains",
    description:
      "Built the Junction blockchain with Cosmos SDK. It checks the proofs sent by ZK rollups. Wrote custom modules and the validator logic.",
    tags: ["Go", "Cosmos SDK", "Tendermint", "L1"],
  },
  {
    title: "Cross-Chain Bridge",
    company: "Airchains",
    description:
      "Designed a bridge that moves tokens between Cosmos and EVM chains. Built stablecoin issuing and safe messages between chains with IBC.",
    tags: ["Solidity", "Cosmos", "Bridge", "IBC"],
  },

  {
    title: "Blockchain Explorer",
    company: "Retcons",
    description:
      "Built a fast block explorer from zero. It shows live transactions, block charts, and details for each address.",
    tags: ["Next.js", "WebSockets", "Data Indexing"],
  },
  {
    title: "Smart Contract Builder",
    company: "Retcons",
    description:
      "Made a tool that creates ERC-20 and NFT smart contracts without writing code. Users drag and drop the parts they need.",
    tags: ["Solidity", "Code Gen", "React", "Tools"],
  },
]

