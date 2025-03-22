import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Decentralized Finance",
    excerpt: "Exploring how DeFi is reshaping the financial landscape and what to expect in the coming years.",
    category: "Blockchain",
    date: "March 15, 2023",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["DeFi", "Ethereum", "Finance"],
  },
  {
    id: 2,
    title: "Integrating AI with Smart Contracts",
    excerpt: "A technical guide on how to combine artificial intelligence with blockchain smart contracts.",
    category: "AI",
    date: "February 28, 2023",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["AI", "Smart Contracts", "Development"],
  },
  {
    id: 3,
    title: "Building Scalable dApps",
    excerpt: "Best practices for creating decentralized applications that can handle high user loads.",
    category: "Development",
    date: "January 10, 2023",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["dApps", "Scalability", "Web3"],
  },
  {
    id: 4,
    title: "The Rise of NFT Marketplaces",
    excerpt: "Analyzing the growth of NFT platforms and what makes them successful.",
    category: "NFTs",
    date: "December 5, 2022",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["NFT", "Marketplace", "Digital Art"],
  },
  {
    id: 5,
    title: "Zero-Knowledge Proofs Explained",
    excerpt: "A comprehensive guide to understanding zero-knowledge proofs and their applications.",
    category: "Cryptography",
    date: "November 20, 2022",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["ZK-Proofs", "Privacy", "Cryptography"],
  },
  {
    id: 6,
    title: "The Evolution of DAOs",
    excerpt: "How Decentralized Autonomous Organizations are changing organizational structures.",
    category: "Blockchain",
    date: "October 15, 2022",
    author: "Aakash",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["DAO", "Governance", "Web3"],
  },
]

const categories = ["All", "Blockchain", "AI", "Development", "NFTs", "Cryptography"]

export default function BlogsPage() {
  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Blogs</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, tutorials, and thoughts on blockchain, AI, and the future of technology.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search articles..." className="pl-10" />
        </div>

        <Tabs defaultValue="All" className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm py-2">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blogs/${post.id}`} key={post.id} className="group">
            <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>

                <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <Button variant="outline" size="sm" className="mx-1">
          Previous
        </Button>
        <Button variant="outline" size="sm" className="mx-1 bg-primary text-white">
          1
        </Button>
        <Button variant="outline" size="sm" className="mx-1">
          2
        </Button>
        <Button variant="outline" size="sm" className="mx-1">
          3
        </Button>
        <Button variant="outline" size="sm" className="mx-1">
          Next
        </Button>
      </div>
    </main>
  )
}

