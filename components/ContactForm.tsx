"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight } from "lucide-react"
import { composeUrl, email } from "@/lib/site"

const topics = ["A new project", "A job offer", "Training or a workshop", "A question", "Something else"]

// The site has no mail server, so the form opens Gmail in a new tab with the message filled in.
// "Use your email app" sends the same message through a mailto: link instead.
export default function ContactForm() {
  const [name, setName] = useState("")
  const [topic, setTopic] = useState(topics[0])
  const [message, setMessage] = useState("")

  const subject = `${topic} — from ${name}`
  const body = `${message}\n\n${name}`

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.open(composeUrl(subject, body), "_blank", "noopener,noreferrer")
  }

  function sendWithApp() {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form className="press-form" onSubmit={send}>
      <label>Your name<input type="text" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
      <label>What is it about?<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Your message<textarea name="message" rows={6} required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell me what you need" /></label>
      <button type="submit" className="press-button">Send message <ArrowRight size={17} /></button>
      <p className="press-form-note">This opens Gmail in a new tab with your message ready. Press Send there. Not using Gmail? <button type="button" className="press-form-alt" onClick={sendWithApp} disabled={!name || !message}>Use your email app</button> or write to {email}.</p>
    </form>
  )
}
