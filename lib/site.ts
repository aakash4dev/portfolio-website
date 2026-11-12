// The live site serves www.aakash4dev.com (aakash4dev.com redirects to it), so every
// canonical URL, sitemap entry, and share link must use this exact address.
export const siteUrl = "https://www.aakash4dev.com"

export const email = "aakash4dev.me@gmail.com"

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blogs" },
  { name: "Tutorials", href: "/tutorials" },
  { name: "Contact", href: "/contact" },
]

export const socialLinks: [string, string][] = [
  ["GitHub", "https://github.com/aakash4dev"],
  ["YouTube", "https://www.youtube.com/@aakash4dev"],
  ["LinkedIn", "https://www.linkedin.com/in/aakash4dev"],
  ["X / Twitter", "https://www.twitter.com/aakash4dev"],
  ["Instagram", "https://www.instagram.com/aakash4dev"],
  ["Medium", "https://medium.com/@aakash4dev"],
  ["Buy me a coffee", "https://coff.ee/aakash4dev"],
]

// Opens Gmail's compose window in a new tab with the address, subject, and message filled in.
// Works in any browser, unlike mailto: links, which do nothing when no email app is set up.
export function composeUrl(subject = "Hello Aakash", body = "") {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: email, su: subject })
  if (body) params.set("body", body)
  return `https://mail.google.com/mail/?${params.toString()}`
}
