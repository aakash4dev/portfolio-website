import type React from "react"
export const metadata = {
  title: "Surprise | Aakash",
  description: "Take a break and have some fun with interactive games!",
}

export default function SurpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

