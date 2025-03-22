"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Code,
  Terminal,
  Zap,
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  Play,
  Lightbulb,
  Gift,
  ChevronDown,
  X,
  Database,
  ArrowRight,
  Fingerprint,
  Key,
  Dice1Icon as Dice,
  Trophy,
  ExternalLink,
  Heart,
  Star,
  Plus,
  Minus,
  Wrench,
  Globe,
  Shield,
  Home,
  MapPin,
  Calendar,
  CheckCircle2,
  Plane,
  Mountain,
  Waves,
  Palmtree,
  Backpack,
  Sailboat,
  Flame,
  Wind,
  Palette,
  Trash2Icon,
  PencilLineIcon,
  Gauge,
  RotateCcw,
  Save,
  SearchIcon,
  FileCode,
  FileText,
  FileEdit,
  FileCheck,
  FileJsonIcon as FileJsIcon,
  FileIcon as FileHtmlIcon,
  FileIcon as FileSqlIcon,
  FileIcon as FilePythonIcon,
  Box,
  Infinity,
} from "lucide-react"
import confetti from "canvas-confetti"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Secret code tracking
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

// Adventure activities data
const adventureActivities = [
  {
    id: 1,
    name: "Sky Diving",
    description: "Experience the ultimate free fall from 14,000 feet with breathtaking views.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Plane className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-400",
    locations: ["Dubai", "New Zealand", "Switzerland"],
    difficulty: "High",
    duration: "1 day",
    bestSeason: "Summer, Spring",
    cost: "$$$$",
    tags: ["adrenaline", "heights", "flying"],
  },
  {
    id: 2,
    name: "Scuba Diving",
    description: "Explore vibrant coral reefs and marine life in crystal clear waters.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Waves className="h-6 w-6" />,
    color: "from-cyan-500 to-blue-600",
    locations: ["Great Barrier Reef", "Maldives", "Thailand"],
    difficulty: "Medium",
    duration: "1-3 days",
    bestSeason: "Year-round",
    cost: "$$$",
    tags: ["underwater", "nature", "marine"],
  },
  {
    id: 3,
    name: "Bungee Jumping",
    description: "Take a leap of faith from towering heights with nothing but a bungee cord.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Flame className="h-6 w-6" />,
    color: "from-red-500 to-orange-500",
    locations: ["New Zealand", "Nepal", "South Africa"],
    difficulty: "High",
    duration: "Half day",
    bestSeason: "Year-round",
    cost: "$$",
    tags: ["adrenaline", "heights", "jumping"],
  },
  {
    id: 4,
    name: "Mountain Climbing",
    description: "Conquer majestic peaks and experience the world from a different perspective.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Mountain className="h-6 w-6" />,
    color: "from-gray-700 to-gray-900",
    locations: ["Himalayas", "Alps", "Andes"],
    difficulty: "Very High",
    duration: "3-14 days",
    bestSeason: "Summer",
    cost: "$$$",
    tags: ["endurance", "heights", "nature"],
  },
  {
    id: 5,
    name: "White Water Rafting",
    description: "Navigate through rushing rapids and experience the power of wild rivers.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Sailboat className="h-6 w-6" />,
    color: "from-blue-600 to-indigo-600",
    locations: ["Colorado", "Costa Rica", "New Zealand"],
    difficulty: "Medium",
    duration: "1 day",
    bestSeason: "Spring, Summer",
    cost: "$$",
    tags: ["water", "teamwork", "nature"],
  },
  {
    id: 6,
    name: "Paragliding",
    description: "Soar through the skies and enjoy panoramic views of breathtaking landscapes.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Wind className="h-6 w-6" />,
    color: "from-sky-400 to-blue-500",
    locations: ["Switzerland", "Nepal", "France"],
    difficulty: "Medium",
    duration: "Half day",
    bestSeason: "Summer, Spring",
    cost: "$$",
    tags: ["flying", "heights", "scenic"],
  },
  {
    id: 7,
    name: "Surfing",
    description: "Ride the waves and experience the thrill of ocean surfing.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Waves className="h-6 w-6" />,
    color: "from-blue-400 to-teal-500",
    locations: ["Hawaii", "Australia", "Indonesia"],
    difficulty: "Medium",
    duration: "1-7 days",
    bestSeason: "Varies by location",
    cost: "$$",
    tags: ["water", "balance", "ocean"],
  },
  {
    id: 8,
    name: "Jungle Trekking",
    description: "Explore dense rainforests and discover exotic wildlife in their natural habitat.",
    image: "/placeholder.svg?height=400&width=600",
    icon: <Palmtree className="h-6 w-6" />,
    color: "from-green-600 to-emerald-700",
    locations: ["Amazon", "Borneo", "Costa Rica"],
    difficulty: "Medium",
    duration: "1-5 days",
    bestSeason: "Dry season",
    cost: "$$",
    tags: ["nature", "wildlife", "hiking"],
  },
]

// Programming languages data
const programmingLanguages = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: <FileJsIcon className="h-5 w-5 text-yellow-400" />,
    color: "bg-yellow-400",
    defaultCode: `// Interactive JavaScript Code
function generateFibonacci(n) {
  const sequence = [0, 1];
  
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  
  return sequence;
}

// Generate first 10 Fibonacci numbers
const fibNumbers = generateFibonacci(10);
console.log("Fibonacci Sequence:", fibNumbers);

// Calculate sum of the sequence
const sum = fibNumbers.reduce((a, b) => a + b, 0);
console.log("Sum of Sequence:", sum);

// Find even numbers in the sequence
const evenNumbers = fibNumbers.filter(num => num % 2 === 0);
console.log("Even Numbers:", evenNumbers);

// Map each number to its square
const squares = fibNumbers.map(num => num * num);
console.log("Squared Values:", squares);`,
  },
  {
    id: "python",
    name: "Python",
    icon: <FilePythonIcon className="h-5 w-5 text-blue-500" />,
    color: "bg-blue-500",
    defaultCode: `# Interactive Python Code
def generate_fibonacci(n):
    sequence = [0, 1]
    
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    
    return sequence

# Generate first 10 Fibonacci numbers
fib_numbers = generate_fibonacci(10)
print("Fibonacci Sequence:", fib_numbers)

# Calculate sum of the sequence
total_sum = sum(fib_numbers)
print("Sum of Sequence:", total_sum)

# Find even numbers in the sequence
even_numbers = [num for num in fib_numbers if num % 2 == 0]
print("Even Numbers:", even_numbers)

# Map each number to its square
squares = [num ** 2 for num in fib_numbers]
print("Squared Values:", squares)`,
  },
  {
    id: "html",
    name: "HTML/CSS",
    icon: <FileHtmlIcon className="h-5 w-5 text-orange-500" />,
    color: "bg-orange-500",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Demo</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    
    .card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    .card-header {
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
      color: white;
      padding: 15px 20px;
    }
    
    .card-body {
      padding: 20px;
      background-color: #f9fafb;
    }
    
    .btn {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>
  <h1>Interactive Card Example</h1>
  
  <div class="card">
    <div class="card-header">
      <h2>Adventure Awaits</h2>
    </div>
    <div class="card-body">
      <p>Discover exciting adventures around the world. From mountain climbing to deep sea diving, there's something for everyone.</p>
      <button class="btn">Explore Now</button>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h2>Coding Journey</h2>
    </div>
    <div class="card-body">
      <p>Learn to code with interactive examples and hands-on projects. Build your skills one line at a time.</p>
      <button class="btn">Start Learning</button>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "sql",
    name: "SQL",
    icon: <FileSqlIcon className="h-5 w-5 text-green-500" />,
    color: "bg-green-500",
    defaultCode: `-- Interactive SQL Example
-- Create a table for adventure activities
CREATE TABLE adventures (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('Easy', 'Medium', 'Hard', 'Extreme')),
  location TEXT,
  duration INTEGER, -- in days
  cost INTEGER -- 1-5 scale
);

-- Insert some adventure activities
INSERT INTO adventures (name, difficulty, location, duration, cost)
VALUES 
  ('Sky Diving', 'Hard', 'Dubai', 1, 4),
  ('Scuba Diving', 'Medium', 'Great Barrier Reef', 2, 3),
  ('Bungee Jumping', 'Hard', 'New Zealand', 1, 2),
  ('Mountain Climbing', 'Extreme', 'Himalayas', 7, 5),
  ('White Water Rafting', 'Medium', 'Colorado', 1, 2),
  ('Paragliding', 'Medium', 'Switzerland', 1, 3),
  ('Surfing', 'Medium', 'Hawaii', 3, 2),
  ('Jungle Trekking', 'Medium', 'Amazon', 3, 3);

-- Query all adventures
SELECT * FROM adventures;

-- Find adventures by difficulty
SELECT name, location, cost 
FROM adventures 
WHERE difficulty = 'Medium'
ORDER BY cost;

-- Find adventures that can be done in a day
SELECT name, difficulty, cost 
FROM adventures 
WHERE duration = 1
ORDER BY cost DESC;

-- Calculate average cost by difficulty
SELECT difficulty, AVG(cost) as avg_cost
FROM adventures
GROUP BY difficulty
ORDER BY avg_cost DESC;`,
  },
  {
    id: "rust",
    name: "Rust",
    icon: <FileCode className="h-5 w-5 text-orange-600" />,
    color: "bg-orange-600",
    defaultCode: `// Interactive Rust Code
fn main() {
    println!("Generating Fibonacci sequence...");
    
    // Generate first 10 Fibonacci numbers
    let fib_numbers = generate_fibonacci(10);
    println!("Fibonacci Sequence: {:?}", fib_numbers);
    
    // Calculate sum of the sequence
    let sum: u32 = fib_numbers.iter().sum();
    println!("Sum of Sequence: {}", sum);
    
    // Find even numbers in the sequence
    let even_numbers: Vec<u32> = fib_numbers.iter()
        .filter(|&&num| num % 2 == 0)
        .cloned()
        .collect();
    println!("Even Numbers: {:?}", even_numbers);
    
    // Map each number to its square
    let squares: Vec<u32> = fib_numbers.iter()
        .map(|&num| num * num)
        .collect();
    println!("Squared Values: {:?}", squares);
}

fn generate_fibonacci(n: usize) -> Vec<u32> {
    let mut sequence = Vec::with_capacity(n);
    
    if n >= 1 {
        sequence.push(0);
    }
    
    if n >= 2 {
        sequence.push(1);
    }
    
    for i in 2..n {
        let next_value = sequence[i-1] + sequence[i-2];
        sequence.push(next_value);
    }
    
    sequence
}`,
  },
]

// Dev tips data
const devTips = [
  {
    id: 1,
    title: "Optimize Your Workflow",
    content:
      "Use keyboard shortcuts and automate repetitive tasks to boost productivity. Tools like Snippets, Macros, and Shell scripts can save hours of work.",
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    tags: ["productivity", "tools", "automation"],
  },
  {
    id: 2,
    title: "Code Readability Matters",
    content:
      "Write code for humans first, machines second. Use meaningful variable names, add comments for complex logic, and follow consistent formatting conventions.",
    icon: <FileEdit className="h-8 w-8 text-blue-500" />,
    tags: ["best practices", "readability", "maintenance"],
  },
  {
    id: 3,
    title: "Test Early, Test Often",
    content:
      "Implement unit tests from the beginning of your project. Test-driven development (TDD) can help catch bugs early and ensure your code works as expected.",
    icon: <FileCheck className="h-8 w-8 text-green-500" />,
    tags: ["testing", "quality", "TDD"],
  },
  {
    id: 4,
    title: "Version Control is Non-Negotiable",
    content:
      "Always use version control, even for small projects. Git allows you to track changes, collaborate effectively, and recover from mistakes.",
    icon: <GitBranch className="h-8 w-8 text-orange-500" />,
    tags: ["git", "collaboration", "best practices"],
  },
  {
    id: 5,
    title: "Continuous Learning",
    content:
      "Technology evolves rapidly. Dedicate time each week to learn new tools, languages, or frameworks. Follow tech blogs, join communities, and contribute to open source.",
    icon: <BookOpen className="h-8 w-8 text-purple-500" />,
    tags: ["learning", "growth", "community"],
  },
  {
    id: 6,
    title: "Security First Mindset",
    content:
      "Consider security implications from the start. Validate inputs, sanitize data, use parameterized queries, and keep dependencies updated to prevent vulnerabilities.",
    icon: <Shield className="h-8 w-8 text-red-500" />,
    tags: ["security", "best practices", "protection"],
  },
  {
    id: 7,
    title: "Performance Optimization",
    content:
      "Measure before optimizing. Use profiling tools to identify bottlenecks, then focus on optimizing the critical paths rather than premature optimization.",
    icon: <Gauge className="h-8 w-8 text-cyan-500" />,
    tags: ["performance", "optimization", "profiling"],
  },
  {
    id: 8,
    title: "Embrace Code Reviews",
    content:
      "Code reviews improve quality and spread knowledge. Be open to feedback, ask questions, and use reviews as learning opportunities for everyone involved.",
    icon: <Users className="h-8 w-8 text-indigo-500" />,
    tags: ["collaboration", "quality", "learning"],
  },
]

// Tools data
const toolsData = [
  {
    id: 1,
    name: "VS Code",
    description: "Powerful, extensible code editor with rich ecosystem of plugins",
    category: "Development",
    url: "https://code.visualstudio.com/",
    icon: <Code className="h-10 w-10 text-blue-500" />,
    tags: ["editor", "IDE", "coding"],
  },
  {
    id: 2,
    name: "GitHub",
    description: "Platform for version control and collaboration on code projects",
    category: "Collaboration",
    url: "https://github.com/",
    icon: <GitBranch className="h-10 w-10 text-gray-700" />,
    tags: ["git", "repository", "open source"],
  },
  {
    id: 3,
    name: "Docker",
    description: "Platform for developing, shipping, and running applications in containers",
    category: "DevOps",
    url: "https://www.docker.com/",
    icon: <Box className="h-10 w-10 text-blue-600" />,
    tags: ["containers", "deployment", "infrastructure"],
  },
  {
    id: 4,
    name: "Figma",
    description: "Collaborative interface design tool for creating UI/UX designs",
    category: "Design",
    url: "https://www.figma.com/",
    icon: <Palette className="h-10 w-10 text-purple-500" />,
    tags: ["design", "UI/UX", "prototyping"],
  },
  {
    id: 5,
    name: "Postman",
    description: "API platform for building and using APIs with automated testing",
    category: "API",
    url: "https://www.postman.com/",
    icon: <Send className="h-10 w-10 text-orange-500" />,
    tags: ["API", "testing", "documentation"],
  },
  {
    id: 6,
    name: "Vercel",
    description: "Platform for frontend frameworks and static sites with global CDN",
    category: "Deployment",
    url: "https://vercel.com/",
    icon: <Globe className="h-10 w-10 text-black" />,
    tags: ["hosting", "deployment", "frontend"],
  },
  {
    id: 7,
    name: "MongoDB",
    description: "Document database with scalability and flexibility for modern apps",
    category: "Database",
    url: "https://www.mongodb.com/",
    icon: <Database className="h-10 w-10 text-green-500" />,
    tags: ["database", "NoSQL", "storage"],
  },
  {
    id: 8,
    name: "Notion",
    description: "All-in-one workspace for notes, tasks, wikis, and databases",
    category: "Productivity",
    url: "https://www.notion.so/",
    icon: <FileText className="h-10 w-10 text-gray-800" />,
    tags: ["notes", "organization", "documentation"],
  },
]

// Terminal commands
const terminalCommands = {
  help: () => {
    return [
      { type: "system", content: "Available commands:" },
      { type: "system", content: "help - Show this help message" },
      { type: "system", content: "about - About this terminal" },
      { type: "system", content: "wishlist - Manage your adventure wishlist" },
      { type: "system", content: "adventures - List available adventure activities" },
      { type: "system", content: "info [adventure] - Get information about an adventure" },
      { type: "system", content: "tools - List development tools" },
      { type: "system", content: "tips - Show development tips" },
      { type: "system", content: "languages - List programming languages" },
      { type: "system", content: "points - Show your current points" },
      { type: "system", content: "achievements - List available achievements" },
      { type: "system", content: "secret - Try to unlock a secret" },
      { type: "system", content: "clear - Clear the terminal" },
      { type: "system", content: "exit - Exit the terminal" },
    ]
  },
  about: () => {
    return [
      { type: "system", content: "🚀 Interactive Terminal v1.0" },
      { type: "system", content: "This terminal allows you to explore various features of the 'Surprise Me' section." },
      { type: "system", content: "You can manage your adventure wishlist, learn about development tools and tips," },
      { type: "system", content: "and discover hidden secrets. Type 'help' to see all available commands." },
    ]
  },
  wishlist: (args) => {
    if (args.length === 0) {
      return [
        { type: "system", content: "Wishlist Commands:" },
        { type: "system", content: "wishlist list - Show your current wishlist" },
        { type: "system", content: "wishlist add [item] - Add an item to your wishlist" },
        { type: "system", content: "wishlist remove [item] - Remove an item from your wishlist" },
        { type: "system", content: "wishlist clear - Clear your entire wishlist" },
      ]
    }

    const subcommand = args[0].toLowerCase()

    if (subcommand === "list") {
      // This would normally fetch from state or localStorage
      return [
        { type: "system", content: "🎯 Your Adventure Wishlist:" },
        { type: "system", content: "1. Sky Diving in Dubai" },
        { type: "system", content: "2. Scuba Diving at the Great Barrier Reef" },
        { type: "system", content: "3. Bungee Jumping in New Zealand" },
        { type: "system", content: "4. Mountain Climbing in the Himalayas" },
      ]
    } else if (subcommand === "add" && args.length > 1) {
      const item = args.slice(1).join(" ")
      return [{ type: "success", content: `Added "${item}" to your wishlist!` }]
    } else if (subcommand === "remove" && args.length > 1) {
      const item = args.slice(1).join(" ")
      return [{ type: "success", content: `Removed "${item}" from your wishlist!` }]
    } else if (subcommand === "clear") {
      return [
        {
          type: "system",
          content: "Are you sure you want to clear your wishlist? Type 'wishlist confirm-clear' to confirm.",
        },
      ]
    } else if (subcommand === "confirm-clear") {
      return [{ type: "success", content: "Your wishlist has been cleared." }]
    } else {
      return [
        { type: "error", content: `Unknown wishlist subcommand: ${subcommand}` },
        { type: "system", content: "Type 'wishlist' to see available subcommands." },
      ]
    }
  },
  adventures: () => {
    return [
      { type: "system", content: "🚀 Available Adventure Activities:" },
      ...adventureActivities.map((activity) => ({
        type: "system",
        content: `• ${activity.name} - ${activity.description.substring(0, 60)}...`,
      })),
    ]
  },
  info: (args) => {
    if (!args.length) {
      return [{ type: "error", content: "Please specify an activity. Example: info skydiving" }]
    }

    const activityName = args.join(" ")
    const activity = adventureActivities.find((a) => a.name.toLowerCase().includes(activityName.toLowerCase()))

    if (!activity) {
      return [
        { type: "error", content: `Activity '${activityName}' not found. Try 'adventures' to see available options.` },
      ]
    }

    return [
      { type: "system", content: `📌 ${activity.name}` },
      { type: "system", content: activity.description },
      { type: "system", content: `Difficulty: ${activity.difficulty}` },
      { type: "system", content: `Duration: ${activity.duration}` },
      { type: "system", content: `Best Season: ${activity.bestSeason}` },
      { type: "system", content: `Cost: ${activity.cost}` },
      { type: "system", content: `Popular Locations: ${activity.locations.join(", ")}` },
      { type: "system", content: `Tags: ${activity.tags.join(", ")}` },
    ]
  },
  tools: () => {
    return [
      { type: "system", content: "🛠️ Development Tools:" },
      ...toolsData.slice(0, 5).map((tool) => ({ type: "system", content: `• ${tool.name} - ${tool.description}` })),
      { type: "system", content: "Type 'tools more' to see additional tools." },
    ]
  },
  tips: () => {
    return [
      { type: "system", content: "💡 Development Tips:" },
      ...devTips
        .slice(0, 3)
        .map((tip) => ({ type: "system", content: `• ${tip.title} - ${tip.content.substring(0, 80)}...` })),
      { type: "system", content: "Type 'tips more' to see additional tips." },
    ]
  },
  languages: () => {
    return [
      { type: "system", content: "💻 Programming Languages:" },
      ...programmingLanguages.map((lang) => ({ type: "system", content: `• ${lang.name}` })),
    ]
  },
  points: () => {
    // This would normally fetch from state
    return [
      { type: "system", content: "🏆 You currently have 120 points!" },
      { type: "system", content: "Keep exploring to earn more points and unlock achievements." },
    ]
  },
  achievements: () => {
    // This would normally fetch from state
    return [
      { type: "system", content: "🏅 Achievements:" },
      { type: "system", content: "✅ Explorer - Visit all sections" },
      { type: "system", content: "✅ Coder - Run code in 3 different languages" },
      { type: "system", content: "❌ Adventurer - Add 5 items to your wishlist" },
      { type: "system", content: "❌ Secret Hunter - Find all hidden easter eggs" },
      { type: "system", content: "❌ Terminal Master - Use all terminal commands" },
    ]
  },
  secret: () => {
    return [
      { type: "system", content: "🔒 There's a secret hidden in this page..." },
      { type: "system", content: "Hint: Some classic video games had special codes..." },
      { type: "system", content: "Try using your keyboard to enter a famous sequence." },
    ]
  },
  clear: () => {
    return "CLEAR_TERMINAL"
  },
  exit: () => {
    return [{ type: "system", content: "Exiting terminal... Type any command to reactivate." }]
  },
}

// Missing components
function GitBranch(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
      <path d="M6 15v-1a2 2 0 0 1 2-2h8" />
    </svg>
  )
}

function BookOpen(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function Users(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Circle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function ChevronLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

// Wishlist Component
function WishlistSection() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: "Sky Diving", completed: false, location: "Dubai", targetDate: "2025-06-15", priority: "High" },
    {
      id: 2,
      name: "Scuba Diving",
      completed: false,
      location: "Great Barrier Reef",
      targetDate: "2025-08-20",
      priority: "Medium",
    },
    {
      id: 3,
      name: "Bungee Jumping",
      completed: false,
      location: "New Zealand",
      targetDate: "2025-10-05",
      priority: "High",
    },
    {
      id: 4,
      name: "Mountain Climbing",
      completed: false,
      location: "Himalayas",
      targetDate: "2026-05-10",
      priority: "Medium",
    },
  ])
  const [newWishItem, setNewWishItem] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newTargetDate, setNewTargetDate] = useState("")
  const [newPriority, setNewPriority] = useState("Medium")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterPriority, setFilterPriority] = useState("All")
  const [sortBy, setSortBy] = useState("dateAdded")
  const { toast } = useToast()

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("adventureWishlist")
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("adventureWishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addWishlistItem = (e) => {
    e.preventDefault()
    if (!newWishItem.trim()) return

    const newItem = {
      id: Date.now(),
      name: newWishItem,
      completed: false,
      location: newLocation || "To be decided",
      targetDate: newTargetDate || "Not set",
      priority: newPriority,
      dateAdded: new Date().toISOString(),
    }

    setWishlistItems([...wishlistItems, newItem])
    setNewWishItem("")
    setNewLocation("")
    setNewTargetDate("")
    setNewPriority("Medium")
    setIsAddingNew(false)

    // Show toast notification
    toast({
      title: "Adventure added!",
      description: `${newWishItem} has been added to your wishlist.`,
      variant: "default",
    })

    // Small confetti burst
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
    })
  }

  const updateWishlistItem = (e) => {
    e.preventDefault()
    if (!editingItem || !editingItem.name.trim()) return

    setWishlistItems(wishlistItems.map((item) => (item.id === editingItem.id ? editingItem : item)))

    setEditingItem(null)

    // Show toast notification
    toast({
      title: "Adventure updated!",
      description: `${editingItem.name} has been updated.`,
      variant: "default",
    })
  }

  const toggleItemCompletion = (id) => {
    setWishlistItems(wishlistItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))

    // If marking as completed, celebrate with confetti
    const item = wishlistItems.find((item) => item.id === id)
    if (item && !item.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Show toast notification
      toast({
        title: "Adventure completed!",
        description: `Congratulations on completing ${item.name}!`,
        variant: "success",
      })
    }
  }

  const removeWishlistItem = (id) => {
    const itemToRemove = wishlistItems.find((item) => item.id === id)

    setWishlistItems(wishlistItems.filter((item) => item.id !== id))

    // Show toast notification
    toast({
      title: "Adventure removed",
      description: `${itemToRemove.name} has been removed from your wishlist.`,
      variant: "destructive",
      action: (
        <ToastAction altText="Undo" onClick={() => setWishlistItems((prev) => [...prev, itemToRemove])}>
          Undo
        </ToastAction>
      ),
    })
  }

  const startEditing = (item) => {
    setEditingItem({ ...item })
  }

  const cancelEditing = () => {
    setEditingItem(null)
  }

  // Filter and sort wishlist items
  const filteredAndSortedItems = wishlistItems
    .filter((item) => filterPriority === "All" || item.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else if (sortBy === "targetDate") {
        if (a.targetDate === "Not set") return 1
        if (b.targetDate === "Not set") return -1
        return new Date(a.targetDate) - new Date(b.targetDate)
      } else {
        // Default: dateAdded
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
      }
    })

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Mountain className="h-6 w-6 text-cyan-500 mr-2" />
          <h2 className="text-2xl font-bold">Adventure Wishlist</h2>
        </div>

        <div className="flex gap-2">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="High">High Priority</SelectItem>
              <SelectItem value="Medium">Medium Priority</SelectItem>
              <SelectItem value="Low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="targetDate">Target Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        {isAddingNew ? (
          <form onSubmit={addWishlistItem} className="space-y-4 glass p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium mb-1 block">Adventure Name</Label>
              <Input
                value={newWishItem}
                onChange={(e) => setNewWishItem(e.target.value)}
                placeholder="e.g., Paragliding"
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">Location</Label>
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g., Switzerland"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Target Date</Label>
                <Input type="date" value={newTargetDate} onChange={(e) => setNewTargetDate(e.target.value)} />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Adventure
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsAddingNew(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Adventure
          </Button>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Adventure</h3>

            <form onSubmit={updateWishlistItem} className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">Adventure Name</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g., Paragliding"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Location</Label>
                <Input
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="e.g., Switzerland"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Target Date</Label>
                <Input
                  type="date"
                  value={editingItem.targetDate !== "Not set" ? editingItem.targetDate : ""}
                  onChange={(e) => setEditingItem({ ...editingItem, targetDate: e.target.value || "Not set" })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Priority</Label>
                <Select
                  value={editingItem.priority}
                  onChange={(value) => setEditingItem({ ...editingItem, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={cancelEditing} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredAndSortedItems.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                item.completed
                  ? "bg-green-900/20 border border-green-500/30"
                  : item.priority === "High"
                    ? "bg-red-900/10 border border-red-500/30"
                    : item.priority === "Medium"
                      ? "bg-yellow-900/10 border border-yellow-500/30"
                      : "bg-blue-900/10 border border-blue-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-0 h-6 w-6 ${item.completed ? "text-green-500" : "text-muted-foreground"}`}
                  onClick={() => toggleItemCompletion(item.id)}
                >
                  {item.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </Button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.name}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.location && item.location !== "To be decided" && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </Badge>
                    )}
                    {item.targetDate && item.targetDate !== "Not set" && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.targetDate).toLocaleDateString()}
                      </Badge>
                    )}
                    <Badge
                      className={`flex items-center gap-1 text-xs ${
                        item.priority === "High"
                          ? "bg-red-500/20 text-red-500"
                          : item.priority === "Medium"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      <Star className="h-3 w-3" />
                      {item.priority} Priority
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(item)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <PencilLineIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWishlistItem(item.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Backpack className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Your adventure wishlist is empty or no items match your filter. Add some exciting activities!</p>
        </div>
      )}

      {wishlistItems.some((item) => item.completed) && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center mb-3">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium">Your Achievements</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            You've completed {wishlistItems.filter((item) => item.completed).length} out of {wishlistItems.length}{" "}
            adventures!
          </p>
          <Progress
            value={(wishlistItems.filter((item) => item.completed).length / wishlistItems.length) * 100}
            className="h-2"
          />
        </div>
      )}
    </div>
  )
}

// Interactive Code Editor Component
function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [codeSnippet, setCodeSnippet] = useState("")
  const [codeOutput, setCodeOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState("dark")
  const [autoSave, setAutoSave] = useState(true)
  const { toast } = useToast()

  // Set initial code snippet based on selected language
  useEffect(() => {
    const language = programmingLanguages.find((lang) => lang.id === selectedLanguage)
    if (language) {
      // Check if we have saved code for this language
      const savedCode = localStorage.getItem(`code_${selectedLanguage}`)
      if (savedCode) {
        setCodeSnippet(savedCode)
      } else {
        setCodeSnippet(language.defaultCode)
      }
    }
  }, [selectedLanguage])

  // Auto-save code when it changes (if enabled)
  useEffect(() => {
    if (autoSave && codeSnippet) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`code_${selectedLanguage}`, codeSnippet)
      }, 1000)

      return () => clearTimeout(saveTimeout)
    }
  }, [codeSnippet, selectedLanguage, autoSave])

  // Run code
  const runCode = () => {
    setIsRunning(true)
    setCodeOutput("")

    // Show toast notification
    toast({
      title: "Running code...",
      description: `Executing ${selectedLanguage} code.`,
    })

    // Simulate code execution with a delay
    setTimeout(() => {
      try {
        if (selectedLanguage === "javascript") {
          // Create a safe execution environment
          const originalConsoleLog = console.log
          const logs = []

          // Override console.log to capture output
          console.log = (...args) => {
            logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)).join(" "))
          }

          // Execute the code
          try {
            // Use Function constructor to avoid scope issues
            new Function(codeSnippet)()
            setCodeOutput(logs.join("\n"))
          } catch (error) {
            setCodeOutput(`Error: ${error.message}`)
          }

          // Restore original console.log
          console.log = originalConsoleLog
        } else if (selectedLanguage === "python") {
          // Simulate Python execution
          setCodeOutput(`Running Python code...\n\n${simulatePythonExecution()}\n\nExecution complete!`)
        } else if (selectedLanguage === "html") {
          // For HTML, we'll show a preview instead
          setCodeOutput("HTML preview generated. Check the preview panel.")

          // In a real implementation, we would render the HTML in an iframe
        } else {
          // For other languages that can't run in the browser
          setCodeOutput(
            `This is a simulated environment. In a real implementation, ${selectedLanguage.toUpperCase()} code would be sent to a server for execution.\n\n// Simulated output for ${selectedLanguage}:\nCompiling...\nBuild successful!\nRunning...\nExecution complete!`,
          )
        }
      } catch (error) {
        setCodeOutput(`Error: ${error.message}`)
      }

      setIsRunning(false)

      // Show success toast
      toast({
        title: "Code executed!",
        description: "Your code has been run successfully.",
        variant: "success",
      })
    }, 1500)
  }

  // Simulate Python execution
  const simulatePythonExecution = () => {
    if (codeSnippet.includes("generate_fibonacci")) {
      return `Fibonacci Sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
Sum of Sequence: 88
Even Numbers: [0, 2, 8, 34]
Squared Values: [0, 1, 1, 4, 9, 25, 64, 169, 441, 1156]`
    } else {
      return `Executing Python code...
Process completed with exit code 0.`
    }
  }

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)

      // Show toast notification
      toast({
        title: "Code copied!",
        description: "Code has been copied to clipboard.",
      })
    })
  }

  // Reset code to default
  const resetCode = () => {
    const language = programmingLanguages.find((lang) => lang.id === selectedLanguage)
    if (language) {
      setCodeSnippet(language.defaultCode)

      // Show toast notification
      toast({
        title: "Code reset",
        description: `${language.name} code has been reset to default.`,
      })
    }
  }

  // Save code manually
  const saveCode = () => {
    localStorage.setItem(`code_${selectedLanguage}`, codeSnippet)

    // Show toast notification
    toast({
      title: "Code saved!",
      description: "Your code has been saved to local storage.",
      variant: "success",
    })
  }

  return (
    <div className="glass rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="h-5 w-5 text-primary mr-2" />
          <div className="text-lg font-medium">Interactive Code Editor</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-save" className="text-sm">
              Auto-save
            </Label>
            <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFontSize((prev) => Math.max(10, prev - 2))}
              disabled={fontSize <= 10}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm w-8 text-center">{fontSize}px</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
              disabled={fontSize >= 24}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {programmingLanguages.map((language) => (
          <Button
            key={language.id}
            variant={selectedLanguage === language.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLanguage(language.id)}
            className={selectedLanguage === language.id ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
          >
            {language.icon}
            <span className="ml-2">{language.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="flex flex-col h-[500px]">
          <div className="bg-muted/30 p-2 rounded-t-lg flex justify-between items-center">
            <span className="text-sm font-medium">Editor</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetCode}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              {!autoSave && (
                <Button variant="ghost" size="sm" onClick={saveCode}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={copyCode} disabled={isCopied}>
                {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className={`flex-1 w-full p-4 font-mono text-sm bg-background/80 rounded-b-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
            style={{
              fontSize: `${fontSize}px`,
              backgroundColor: theme === "light" ? "#f8fafc" : "#1e293b",
            }}
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col h-[500px]">
          <div className="bg-muted/30 p-2 rounded-t-lg flex justify-between items-center">
            <span className="text-sm font-medium">Output</span>
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Run Code
                </>
              )}
            </Button>
          </div>
          <div
            className={`bg-background/80 p-4 h-full rounded-b-lg border border-border font-mono text-sm overflow-auto whitespace-pre-wrap ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
            style={{
              fontSize: `${fontSize}px`,
              backgroundColor: theme === "light" ? "#f8fafc" : "#1e293b",
            }}
          >
            {codeOutput ||
              `// Run your code to see the output here
// Click the "Run Code" button above`}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Experiment with different programming languages. Your code is automatically saved as you type.</p>
      </div>
    </div>
  )
}

// Terminal Component
function TerminalComponent() {
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "system", content: "🚀 Interactive Terminal v1.0.0" },
    { type: "system", content: "Type 'help' to see available commands" },
  ])
  const [terminalPrompt, setTerminalPrompt] = useState("user@adventure:~$")
  const [isTerminalActive, setIsTerminalActive] = useState(true)
  const terminalRef = useRef(null)
  const { toast } = useToast()

  // Effect to scroll terminal to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  // Handle terminal input
  const handleTerminalInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()

      // If terminal is inactive, reactivate it
      if (!isTerminalActive) {
        setIsTerminalActive(true)
        setTerminalHistory([
          { type: "system", content: "🚀 Interactive Terminal v1.0.0" },
          { type: "system", content: "Type 'help' to see available commands" },
        ])
        setTerminalInput("")
        return
      }

      // Add user command to history
      const newHistory = [...terminalHistory, { type: "command", content: `${terminalPrompt} ${terminalInput}` }]

      // Process command
      const inputParts = terminalInput.trim().toLowerCase().split(" ")
      const command = inputParts[0]
      const args = inputParts.slice(1)

      if (command) {
        if (command in terminalCommands) {
          const result = terminalCommands[command](args)

          if (result === "CLEAR_TERMINAL") {
            setTerminalHistory([
              { type: "system", content: "🚀 Interactive Terminal v1.0.0" },
              { type: "system", content: "Type 'help' to see available commands" },
            ])
          } else if (command === "exit") {
            setIsTerminalActive(false)
            setTerminalHistory([...newHistory, ...result])
          } else {
            setTerminalHistory([...newHistory, ...result])
          }
        } else {
          setTerminalHistory([
            ...newHistory,
            { type: "error", content: `Command not found: ${command}` },
            { type: "system", content: "Type 'help' to see available commands" },
          ])
        }
      }

      // Clear input
      setTerminalInput("")
    }
  }

  return (
    <div className="glass rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-muted-foreground">Interactive Terminal</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => {
              setTerminalHistory([
                { type: "system", content: "🚀 Interactive Terminal v1.0.0" },
                { type: "system", content: "Type 'help' to see available commands" },
              ])
              toast({
                title: "Terminal cleared",
                description: "Terminal history has been cleared.",
              })
            }}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="bg-black/90 text-green-500 font-mono text-sm rounded-lg p-4 h-[400px] overflow-y-auto"
      >
        {terminalHistory.map((entry, index) => (
          <div
            key={index}
            className={`mb-1 ${
              entry.type === "command"
                ? "text-white"
                : entry.type === "error"
                  ? "text-red-500"
                  : entry.type === "success"
                    ? "text-green-500"
                    : ""
            }`}
          >
            {entry.content}
          </div>
        ))}

        {isTerminalActive && (
          <div className="flex">
            <span className="text-white">{terminalPrompt}</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalInput}
              className="flex-1 bg-transparent border-none outline-none text-white ml-2"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        <p>Type 'help' to see available commands. Try 'adventures', 'wishlist', or 'secret'.</p>
      </div>
    </div>
  )
}

// Dev Tips Component
function DevTipsComponent() {
  const [selectedTags, setSelectedTags] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Get all unique tags
  const allTags = [...new Set(devTips.flatMap((tip) => tip.tags))]

  // Filter tips based on selected tags and search query
  const filteredTips = devTips.filter((tip) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => tip.tags.includes(tag))

    const matchesSearch =
      searchQuery === "" ||
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTags && matchesSearch
  })

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex items-center mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold">Development Tips</h2>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-primary" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.length > 0 ? (
          filteredTips.map((tip) => (
            <Card
              key={tip.id}
              className="overflow-hidden border-border/30 hover:border-primary/50 transition-colors duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-background/50">{tip.icon}</div>
                  <div>
                    <CardTitle>{tip.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tip.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tip.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tips found matching your filters. Try adjusting your search or selected tags.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Tools Component
function ToolsComponent() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Get all unique categories
  const categories = ["All", ...new Set(toolsData.map((tool) => tool.category))]

  // Filter tools based on selected category and search query
  const filteredTools = toolsData.filter((tool) => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory

    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex items-center mb-6">
        <Wrench className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-bold">Development Tools</h2>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="overflow-hidden border-border/30 hover:border-primary/50 transition-colors duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-background/50">{tool.icon}</div>
                  <div>
                    <CardTitle>{tool.name}</CardTitle>
                    <Badge className="mt-1">{tool.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" asChild className="w-full">
                  <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tools found matching your filters. Try adjusting your search or selected category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Feature Box Component
function FeatureBox({ title, description, icon, color, onClick }) {
  return (
    <Card
      className="overflow-hidden border-border/30 hover:border-primary/50 transition-colors duration-300 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 p-4 rounded-full ${color}`}>{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>{description}</p>
      </CardContent>
      <CardFooter className="pt-0 justify-center">
        <Button variant="outline" className="w-full">
          Explore
        </Button>
      </CardFooter>
    </Card>
  )
}

// Recommendations Component
function RecommendationsComponent() {
  const [userInterests, setUserInterests] = useState([
    { id: "adventure", name: "Adventure", selected: true },
    { id: "coding", name: "Coding", selected: true },
    { id: "travel", name: "Travel", selected: false },
    { id: "photography", name: "Photography", selected: false },
    { id: "music", name: "Music", selected: false },
    { id: "gaming", name: "Gaming", selected: false },
    { id: "fitness", name: "Fitness", selected: false },
    { id: "cooking", name: "Cooking", selected: false },
    { id: "reading", name: "Reading", selected: false },
    { id: "art", name: "Art", selected: false },
  ])

  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Toggle interest selection
  const toggleInterest = (id) => {
    setUserInterests(
      userInterests.map((interest) => (interest.id === id ? { ...interest, selected: !interest.selected } : interest)),
    )
  }

  // Generate recommendations based on selected interests
  const generateRecommendations = () => {
    setIsLoading(true)

    // Show toast notification
    toast({
      title: "Generating recommendations...",
      description: "Please wait while we analyze your interests.",
    })

    // Simulate API call with a delay
    setTimeout(() => {
      const selectedInterests = userInterests.filter((interest) => interest.selected).map((i) => i.id)

      // Generate recommendations based on selected interests
      const newRecommendations = []

      if (selectedInterests.includes("adventure")) {
        newRecommendations.push(
          {
            id: 1,
            type: "adventure",
            title: "Paragliding in Switzerland",
            description: "Experience the thrill of soaring through the Swiss Alps with experienced guides.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["adventure", "flying", "mountains"],
          },
          {
            id: 2,
            type: "adventure",
            title: "Scuba Diving in Thailand",
            description: "Explore vibrant coral reefs and exotic marine life in the warm waters of Thailand.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["adventure", "underwater", "travel"],
          },
        )
      }

      if (selectedInterests.includes("coding")) {
        newRecommendations.push(
          {
            id: 3,
            type: "coding",
            title: "Learn Rust Programming",
            description: "Dive into Rust, a language empowering everyone to build reliable and efficient software.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["coding", "programming", "learning"],
          },
          {
            id: 4,
            type: "coding",
            title: "Build a Personal Portfolio",
            description: "Create an impressive portfolio website to showcase your projects and skills.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["coding", "web development", "career"],
          },
        )
      }

      if (selectedInterests.includes("travel")) {
        newRecommendations.push({
          id: 5,
          type: "travel",
          title: "Explore Kyoto, Japan",
          description: "Discover ancient temples, beautiful gardens, and traditional culture in Kyoto.",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["travel", "culture", "history"],
        })
      }

      if (selectedInterests.includes("photography")) {
        newRecommendations.push({
          id: 6,
          type: "photography",
          title: "Landscape Photography Workshop",
          description: "Learn techniques for capturing stunning landscape photos in any environment.",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["photography", "learning", "nature"],
        })
      }

      if (selectedInterests.includes("music")) {
        newRecommendations.push({
          id: 7,
          type: "music",
          title: "Learn to Play Guitar",
          description: "Start your musical journey with guided guitar lessons for beginners.",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["music", "learning", "instrument"],
        })
      }

      if (selectedInterests.includes("gaming")) {
        newRecommendations.push({
          id: 8,
          type: "gaming",
          title: "Build Your Own Game",
          description: "Create a simple game using JavaScript and HTML5 Canvas.",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["gaming", "coding", "creativity"],
        })
      }

      if (selectedInterests.includes("fitness")) {
        newRecommendations.push({
          id: 9,
          type: "fitness",
          title: "30-Day Fitness Challenge",
          description: "Transform your body and build healthy habits with this structured program.",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["fitness", "health", "challenge"],
        })
      }

      // Shuffle recommendations for variety
      const shuffled = [...newRecommendations].sort(() => 0.5 - Math.random())

      setRecommendations(shuffled.slice(0, 6)) // Limit to 6 recommendations
      setIsLoading(false)

      // Show success toast
      toast({
        title: "Recommendations ready!",
        description: "We've generated personalized recommendations based on your interests.",
        variant: "success",
      })
    }, 2000)
  }

  // Generate initial recommendations on component mount
  useEffect(() => {
    generateRecommendations()
  }, [])

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex items-center mb-6">
        <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
        <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Your Interests</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {userInterests.map((interest) => (
            <Badge
              key={interest.id}
              variant={interest.selected ? "default" : "outline"}
              className={`cursor-pointer ${interest.selected ? "bg-primary" : ""}`}
              onClick={() => toggleInterest(interest.id)}
            >
              {interest.name}
              {interest.selected && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>

        <Button
          onClick={generateRecommendations}
          disabled={isLoading || userInterests.filter((i) => i.selected).length === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Update Recommendations
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="overflow-hidden border-border/30 hover:border-primary/50 transition-colors duration-300"
          >
            <div className="relative h-40">
              <Image
                src={recommendation.image || "/placeholder.svg"}
                alt={recommendation.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{recommendation.title}</CardTitle>
              <div className="flex flex-wrap gap-1">
                {recommendation.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recommendation.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function SurprisePage() {
  // State
  const [secretProgress, setSecretProgress] = useState([])
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [points, setPoints] = useState(0)
  const [achievements, setAchievements] = useState({
    explorer: false,
    coder: false,
    adventurer: false,
    easter: false,
  })
  const [activeSection, setActiveSection] = useState(null)
  const { toast } = useToast()

  // Refs
  const welcomeRef = useRef(null)
  const wishlistRef = useRef(null)
  const terminalRef = useRef(null)
  const devTipsRef = useRef(null)
  const codeRef = useRef(null)
  const toolsRef = useRef(null)

  // Navigation
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
    // Track section visits for explorer achievement
    trackSectionVisit(ref)
  }

  // Effect to track key presses for secret code
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Update secret code progress
      if (KONAMI_CODE[secretProgress.length] === e.key) {
        const newProgress = [...secretProgress, e.key]
        setSecretProgress(newProgress)

        // Check if code is complete
        if (newProgress.length === KONAMI_CODE.length) {
          // Unlock secret
          setSecretUnlocked(true)
          awardPoints(50)
          unlockAchievement("easter")
          triggerConfetti()
          setSecretProgress([])

          // Show toast notification
          toast({
            title: "Secret Unlocked!",
            description: "You've discovered the Konami Code easter egg!",
            variant: "success",
          })
        }
      } else {
        // Reset progress if wrong key
        setSecretProgress([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [secretProgress])

  // Track section visits for explorer achievement
  const trackSectionVisit = (ref) => {
    // Get section name from ref
    const sectionName =
      Object.entries({
        welcomeRef,
        wishlistRef,
        terminalRef,
        devTipsRef,
        codeRef,
        toolsRef,
      })
        .find(([_, val]) => val === ref)?.[0]
        ?.replace("Ref", "") || ""

    if (!sectionName) return

    // Get visited sections from localStorage
    const visitedSections = JSON.parse(localStorage.getItem("visitedSections") || "[]")

    // Add section if not already visited
    if (!visitedSections.includes(sectionName)) {
      const newVisitedSections = [...visitedSections, sectionName]
      localStorage.setItem("visitedSections", JSON.stringify(newVisitedSections))

      // Check if explorer achievement should be unlocked
      if (newVisitedSections.length >= 3 && !achievements.explorer) {
        unlockAchievement("explorer")
        awardPoints(20)

        // Show toast notification
        toast({
          title: "Achievement Unlocked!",
          description: "Explorer: You've visited 3 different sections!",
          variant: "success",
        })
      }
    }
  }

  // Function to award points
  const awardPoints = (amount) => {
    setPoints((prev) => prev + amount)

    // Save points to localStorage
    localStorage.setItem("surprise_points", (points + amount).toString())
  }

  // Function to unlock achievements
  const unlockAchievement = (achievement) => {
    if (!achievements[achievement]) {
      setAchievements((prev) => ({
        ...prev,
        [achievement]: true,
      }))

      // Save achievements to localStorage
      const updatedAchievements = {
        ...achievements,
        [achievement]: true,
      }
      localStorage.setItem("surprise_achievements", JSON.stringify(updatedAchievements))
    }
  }

  // Function to trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Load points and achievements from localStorage on component mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("surprise_points")
    if (savedPoints) {
      setPoints(Number.parseInt(savedPoints))
    }

    const savedAchievements = localStorage.getItem("surprise_achievements")
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Navigation items
  const navItems = [
    { name: "Welcome", ref: welcomeRef, icon: <Home className="h-4 w-4" /> },
    { name: "Wishlist", ref: wishlistRef, icon: <Heart className="h-4 w-4" /> },
    { name: "Terminal", ref: terminalRef, icon: <Terminal className="h-4 w-4" /> },
    { name: "Dev Tips", ref: devTipsRef, icon: <Lightbulb className="h-4 w-4" /> },
    { name: "Code", ref: codeRef, icon: <Code className="h-4 w-4" /> },
    { name: "Tools", ref: toolsRef, icon: <Wrench className="h-4 w-4" /> },
  ]

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Fixed Navigation */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="glass rounded-full p-2 flex flex-col space-y-3">
          {navItems.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-10 w-10 ${
                      activeSection === item.name ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => {
                      scrollToSection(item.ref)
                      setActiveSection(item.name)
                    }}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Points Display */}
      <div className="fixed top-24 right-4 z-50">
        <div className="glass rounded-full px-4 py-2 flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="font-bold">{points}</span>
        </div>
      </div>

      {/* Welcome Section */}
      <section ref={welcomeRef} className="min-h-screen flex flex-col justify-center mb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Surprise Me</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore interactive features, manage your adventure wishlist, and discover hidden surprises in this
            personalized experience.
          </p>
        </div>

        {/* Three Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureBox
            title="Adventure Wishlist"
            description="Create and track your bucket list of exciting adventures and experiences."
            icon={<Heart className="h-8 w-8 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => scrollToSection(wishlistRef)}
          />

          <FeatureBox
            title="Code Playground"
            description="Experiment with different programming languages in an interactive code editor."
            icon={<Code className="h-8 w-8 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            onClick={() => scrollToSection(codeRef)}
          />

          <FeatureBox
            title="Personalized Recommendations"
            description="Discover new adventures and activities based on your interests and preferences."
            icon={<Sparkles className="h-8 w-8 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            onClick={() => setActiveSection("recommendations")}
          />
        </div>

        {/* Recommendations Section (conditionally rendered) */}
        {activeSection === "recommendations" && (
          <div className="mb-12">
            <RecommendationsComponent />
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-2">Scroll down to explore</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-6 w-6 mx-auto text-primary" />
          </motion.div>
        </div>
      </section>

      {/* Wishlist Section */}
      <section ref={wishlistRef} className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          <Heart className="h-6 w-6 inline-block mr-2 text-pink-500" />
          Wishlist
        </h2>

        <WishlistSection />
      </section>

      {/* Terminal Section */}
      <section ref={terminalRef} className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          <Terminal className="h-6 w-6 inline-block mr-2 text-primary" />
          Terminal
        </h2>

        <TerminalComponent />
      </section>

      {/* Dev Tips Section */}
      <section ref={devTipsRef} className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          <Lightbulb className="h-6 w-6 inline-block mr-2 text-yellow-500" />
          Dev Tips
        </h2>

        <DevTipsComponent />
      </section>

      {/* Code Section */}
      <section ref={codeRef} className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          <Code className="h-6 w-6 inline-block mr-2 text-blue-500" />
          Code
        </h2>

        <CodeEditor />
      </section>

      {/* Tools Section */}
      <section ref={toolsRef} className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          <Wrench className="h-6 w-6 inline-block mr-2 text-primary" />
          Tools
        </h2>

        <ToolsComponent />
      </section>

      {/* Secret Panel - Only shown when unlocked */}
      {secretUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 overflow-hidden mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-yellow-400 mr-2" />
              <div className="text-lg font-medium text-yellow-400">Secret Unlocked: Konami Code</div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-500">+50 Points</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background/50 border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Fingerprint className="h-4 w-4 mr-2 text-yellow-400" />
                  Konami Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You discovered the classic Konami Code easter egg! This famous cheat code originated in 1986 with
                  Konami's games.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex space-x-1">
                  <Badge variant="outline" className="text-xs">
                    ↑
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ↑
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ↓
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ↓
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ←
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    →
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ←
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    →
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    B
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    A
                  </Badge>
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-background/50 border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Key className="h-4 w-4 mr-2 text-yellow-400" />
                  Bonus Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You've unlocked special features! Try typing "secret" in the terminal for more hidden commands.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-500/50 text-yellow-400"
                  onClick={() => {
                    scrollToSection(terminalRef)
                    // This would ideally focus the terminal input and pre-fill it
                  }}
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Open Terminal
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-background/50 border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Dice className="h-4 w-4 mr-2 text-yellow-400" />
                  Celebration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Let's celebrate your discovery with some confetti!</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-500/50 text-yellow-400"
                  onClick={triggerConfetti}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Trigger Confetti
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Footer with hint */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Explore all sections to earn points and unlock achievements.
          <span className="text-primary ml-1">
            <ArrowRight className="h-3 w-3 inline-block mx-1" />
            Can you find the hidden easter egg?
          </span>
        </p>
      </div>
    </main>
  )
}

// Add missing FilePython component
function FilePythonIconComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.18 9.4c.15.16.31.31.47.47a2.3 2.3 0 0 1 .47 2.56 2.3 2.3 0 0 1-2.14 1.53h-1.93v1.36c0 .65-.2 1.28-.56 1.81-.37.53-.88.97-1.49 1.26-.61.3-1.29.42-1.97.36-.68-.05-1.33-.27-1.89-.62h-.09c-.23-.16-.43-.34-.62-.54-1.56-1.56-1.56-4.1 0-5.66.79-.78 1.83-1.17 2.87-1.17h5.88Z" />
      <path d="M11.95 7.4c-.15-.16-.31-.31-.47-.47a2.3 2.3 0 0 1-.47-2.56 2.3 2.3 0 0 1 2.14-1.53h1.93V1.5c0-.66.2-1.29.56-1.82.37-.53.88-.97 1.49-1.26.61-.3 1.29-.42 1.97-.36.68.05 1.33.27 1.89.62h.09c.23.16.43.34.62.54 1.56 1.56 1.56 4.1 0 5.66-.79.78-1.83 1.17-2.87 1.17h-5.88Z" />
      <path d="M6.79 15.1c-1.19.58-2.5.88-3.83.88-.93 0-1.83-.57-1.83-1.5v-1.2c0-3.39 2.11-6.2 4.78-7.5" />
      <path d="M17.51 8.7c1.19-.58 2.5-.88 3.83-.88.93 0 1.83.57 1.83 1.5v1.2c0 3.39-2.11 6.2-4.78 7.5" />
    </svg>
  )
}

// Add missing FileSql component
function FileSqlIconComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-4" />
      <path d="M8 18v-2" />
      <path d="M16 18v-6" />
    </svg>
  )
}

// Add missing FileJs component
function FileJsIconComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 12a1 1 0 0 0-1 1v6" />
      <path d="M14 13v5h-3" />
    </svg>
  )
}

