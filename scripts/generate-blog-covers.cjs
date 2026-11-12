// Draws one illustrated cover per article: a scene built from icons that match the article topic,
// drawn in one of seven styles so covers next to each other look different.
// Run with: npm run blogs:covers
const fs = require("node:fs")
const path = require("node:path")
const sharp = require("sharp")
const { blogPosts } = require("./blog-library.cjs")

const W = 1200
const H = 630
const iconDirectory = path.join(__dirname, "../node_modules/lucide-react/dist/esm/icons")

// Each article names its own scene in its "cover" line:
//   hero <main> <icon> <icon> <icon> <icon>   one main icon with four related icons
//   flow <first> <second> <third>             three steps in order
//   versus <left> <right>                     two things compared
//   code <LANGUAGE> <icon>                    a code window plus a topic icon
// Icon names come from https://lucide.dev/icons

// ---------------------------------------------------------------- helpers
function random(seedText) {
  let seed = 2166136261
  for (const letter of seedText) seed = Math.imul(seed ^ letter.charCodeAt(0), 16777619)
  return () => {
    seed += 0x6d2b79f5
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const iconCache = {}
function iconShapes(name) {
  if (iconCache[name]) return iconCache[name]
  const file = path.join(iconDirectory, `${name}.js`)
  if (!fs.existsSync(file)) throw new Error(`Icon not found: ${name}`)
  const source = fs.readFileSync(file, "utf8")
  const list = source.slice(source.indexOf("[", source.indexOf("createLucideIcon(")), source.lastIndexOf("]") + 1)
  const nodes = new Function(`return ${list}`)()
  iconCache[name] = nodes.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).filter(([key]) => key !== "key").map(([key, value]) => `${key}="${value}"`).join(" ")}/>`).join("")
  return iconCache[name]
}

const escape = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
const r1 = (value) => Math.round(value * 10) / 10
const sans = `font-family="Arial, Helvetica, sans-serif"`
const mono = `font-family="DejaVu Sans Mono, Menlo, Consolas, monospace"`

// One line icon, centered on (cx, cy).
function glyph(name, cx, cy, size, color, width = 1.6, extra = "") {
  return `<g transform="translate(${r1(cx - size / 2)} ${r1(cy - size / 2)}) scale(${r1(size / 24 * 100) / 100})" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${iconShapes(name)}</g>`
}

// Start and end of a connector, pulled back so it does not run under the two items.
function between(a, b, gapA, gapB) {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
  const ux = (b.x - a.x) / length
  const uy = (b.y - a.y) / length
  return { x1: r1(a.x + ux * gapA), y1: r1(a.y + uy * gapA), x2: r1(b.x - ux * gapB), y2: r1(b.y - uy * gapB), ux, uy }
}

// Rows of rounded bars that look like lines of code.
function codeLines(win, colors, next, highlight) {
  let out = ""
  let indent = 0
  const rows = Math.floor((win.h - 86) / 31)
  const marked = 2 + Math.floor(next() * (rows - 3))
  for (let row = 0; row < rows; row++) {
    indent = Math.max(0, Math.min(3, indent + Math.floor(next() * 3) - 1))
    let x = win.x + 62 + indent * 28
    const y = win.y + 92 + row * 31
    if (row === marked) out += `<rect x="${win.x + 14}" y="${y - 13}" width="${win.w - 28}" height="27" rx="4" fill="${highlight}" opacity=".2"/>`
    const parts = 1 + Math.floor(next() * 3)
    for (let part = 0; part < parts; part++) {
      const width = 36 + Math.floor(next() * 100)
      if (x + width > win.x + win.w - 34) break
      out += `<rect x="${x}" y="${y - 5}" width="${width}" height="11" rx="5.5" fill="${colors[Math.floor(next() * colors.length)]}"/>`
      x += width + 12
    }
    out += `<rect x="${win.x + 24}" y="${y - 3}" width="16" height="7" rx="3" fill="${colors[0]}" opacity=".35"/>`
  }
  return out
}

// ---------------------------------------------------------------- where things go
// Each layout has a few arrangements so two covers of the same kind are not placed the same way.
function arrange(kind, parts, next) {
  const pickOne = (count) => Math.floor(next() * count)
  if (kind === "hero") {
    const [main, around] = parts
    const variant = pickOne(3)
    const spots = [
      { main: [600, 305, 230], sides: [[195, 170], [1005, 170], [195, 460], [1005, 460]], size: 105, links: [[1, 0], [2, 0], [3, 0], [4, 0]] },
      { main: [325, 315, 270], sides: [[705, 190], [965, 190], [705, 440], [965, 440]], size: 128, links: [[0, 1], [0, 3], [1, 2], [3, 4]] },
      { main: [600, 230, 215], sides: [[210, 500], [470, 500], [730, 500], [990, 500]], size: 96, links: [[0, 1], [0, 2], [0, 3], [0, 4]] },
    ][variant]
    return {
      items: [{ name: main, x: spots.main[0], y: spots.main[1], size: spots.main[2], main: true }, ...around.map((name, i) => ({ name, x: spots.sides[i][0], y: spots.sides[i][1], size: spots.size }))],
      links: spots.links, marks: [],
    }
  }
  if (kind === "flow") {
    const variant = pickOne(3)
    const spots = [[[220, 300], [600, 300], [980, 300]], [[230, 440], [600, 315], [970, 190]], [[230, 205], [600, 425], [970, 205]]][variant]
    const size = variant === 0 ? 178 : 160
    return {
      items: parts.map((name, i) => ({ name, x: spots[i][0], y: spots[i][1], size, main: i === 1 })),
      links: [[0, 1], [1, 2]],
      marks: spots.map(([x, y], i) => ({ text: String(i + 1), x: x - size * 0.72, y: y - size * 0.72, step: true })),
    }
  }
  if (kind === "versus") {
    const variant = pickOne(2)
    const spots = [[[300, 315], [900, 315]], [[315, 220], [885, 410]]][variant]
    return {
      items: parts.map((name, i) => ({ name, x: spots[i][0], y: spots[i][1], size: variant ? 215 : 240, main: true })),
      links: [], marks: [{ text: "VS", x: 600, y: 315 }], divider: variant ? "diagonal" : "straight",
    }
  }
  // code: a window with lines of code, a language badge, and one topic icon
  const [language, topic] = parts
  const mirrored = next() > 0.5
  return {
    items: [{ name: topic, x: mirrored ? 285 : 915, y: 315, size: 225, main: true }],
    links: [], marks: [],
    window: { x: mirrored ? 585 : 95, y: 118, w: 520, h: 396, language },
  }
}

// ---------------------------------------------------------------- seven drawing styles
// Every style draws the same scene data in its own way: background, items, connectors, labels, code window.

const neon = {
  palettes: [
    { bg: ["#1a0b3a", "#0b0620"], cols: ["#c084fc", "#f472b6", "#fde047"] },
    { bg: ["#06203f", "#030a1c"], cols: ["#22d3ee", "#818cf8", "#fbbf24"] },
    { bg: ["#062a26", "#03100f"], cols: ["#34d399", "#60a5fa", "#f9a8d4"] },
    { bg: ["#3a0d2a", "#12040f"], cols: ["#fb7185", "#facc15", "#38bdf8"] },
  ],
  background(P, next) {
    const horizon = 300
    let grid = ""
    for (let i = -14; i <= 14; i++) grid += `<line x1="${600 + i * 26}" y1="${horizon}" x2="${600 + i * 190}" y2="${H}"/>`
    for (let i = 1; i <= 9; i++) { const y = r1(horizon + (H - horizon) * (i / 9) ** 1.9); grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>` }
    let stars = ""
    for (let i = 0; i < 40; i++) stars += `<circle class="${i % 3 ? "" : "twinkle"}" cx="${Math.floor(next() * W)}" cy="${Math.floor(next() * 320)}" r="${r1(0.8 + next() * 1.9)}" fill="${[...P.cols, "#fff"][Math.floor(next() * 4)]}" opacity="${r1(0.3 + next() * 0.6)}"/>`
    return `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.bg[0]}"/><stop offset="1" stop-color="${P.bg[1]}"/></linearGradient><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="floor"><rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#fade)"/></mask></defs><rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="${Math.floor(200 + next() * 250)}" cy="150" r="190" fill="${P.cols[1]}" opacity=".22" filter="url(#haze)"/><circle cx="${Math.floor(750 + next() * 250)}" cy="330" r="220" fill="${P.cols[0]}" opacity=".2" filter="url(#haze)"/>${stars}<g mask="url(#floor)" stroke="${P.cols[0]}" stroke-width="1.2" opacity=".42">${grid}</g>`
  },
  item(P, item, i) {
    const color = P.cols[i % 3]
    const w = item.size * 0.62
    const cy = item.y + item.size * 0.66
    const depth = item.main ? 18 : 10
    const tile = `<ellipse cx="${item.x}" cy="${cy + depth}" rx="${w * 1.25}" ry="${w * 0.6}" fill="${color}" opacity=".16" filter="url(#soft)"/><polygon points="${item.x - w},${cy} ${item.x},${cy + w / 2} ${item.x},${cy + w / 2 + depth} ${item.x - w},${cy + depth}" fill="${color}" opacity=".3"/><polygon points="${item.x + w},${cy} ${item.x},${cy + w / 2} ${item.x},${cy + w / 2 + depth} ${item.x + w},${cy + depth}" fill="${color}" opacity=".18"/><polygon points="${item.x - w},${cy} ${item.x},${cy - w / 2} ${item.x + w},${cy} ${item.x},${cy + w / 2}" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-width="2"/>`
    return `${tile}<g class="float" style="animation-delay:-${i}s">${glyph(item.name, item.x, item.y, item.size, color, 2.6, `opacity=".55" filter="url(#glow)"`)}${glyph(item.name, item.x, item.y, item.size, color, 1.35)}${glyph(item.name, item.x, item.y, item.size, "#fff", 0.4, `opacity=".75"`)}</g>`
  },
  link(P, a, b, i) {
    const s = between({ x: a.x, y: a.y + a.size * 0.66 }, { x: b.x, y: b.y + b.size * 0.66 }, a.size * 0.66, b.size * 0.66)
    return `<path class="dash" d="M${s.x1} ${s.y1} L${s.x2} ${s.y2}" stroke="${P.cols[(i + 1) % 3]}" stroke-width="2.5" stroke-dasharray="10 9" fill="none"/><circle cx="${s.x1}" cy="${s.y1}" r="5" fill="${P.cols[(i + 1) % 3]}"/><circle cx="${s.x2}" cy="${s.y2}" r="5" fill="${P.cols[(i + 1) % 3]}"/>`
  },
  mark(P, mark) {
    const r = mark.step ? 20 : 48
    return `<circle cx="${mark.x}" cy="${mark.y}" r="${r}" fill="${P.bg[1]}" stroke="${P.cols[1]}" stroke-width="2.5"/><text x="${mark.x}" y="${mark.y + r * 0.27}" text-anchor="middle" ${sans} font-size="${r * 0.75}" font-weight="700" fill="${P.cols[1]}">${mark.text}</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x + 14}" y="${win.y + 16}" width="${win.w}" height="${win.h}" rx="14" fill="${P.cols[0]}" opacity=".16" filter="url(#soft)"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="14" fill="${P.bg[1]}" fill-opacity=".88" stroke="${P.cols[0]}" stroke-width="2"/><path d="M${win.x} ${win.y + 52} h${win.w}" stroke="${P.cols[0]}" opacity=".6"/>${[0, 1, 2].map((d) => `<circle cx="${win.x + 28 + d * 24}" cy="${win.y + 27}" r="7" fill="${P.cols[2 - d]}"/>`).join("")}${codeLines(win, [...P.cols, "#e2e8f0"], next, P.cols[2])}${badge(win, P.cols[2], P.bg[1])}`
  },
}

function badge(win, fill, text, extra = "") {
  const width = 30 + win.language.length * 21
  return `<g transform="translate(${win.x + win.w - width - 16} ${win.y - 26})"><rect width="${width}" height="58" rx="10" fill="${fill}" ${extra}/><text x="${width / 2}" y="41" text-anchor="middle" ${sans} font-size="32" font-weight="700" fill="${text}">${escape(win.language)}</text></g>`
}

const sticker = {
  palettes: [
    { bg: "#ffd43b", ink: "#1a1a1a", cols: ["#ffffff", "#ff6b6b", "#4dabf7"] },
    { bg: "#ff8fab", ink: "#1a1a1a", cols: ["#ffffff", "#ffe066", "#74c0fc"] },
    { bg: "#63e6be", ink: "#12261f", cols: ["#ffffff", "#ffd43b", "#ff8787"] },
    { bg: "#748ffc", ink: "#11143a", cols: ["#ffffff", "#ffe066", "#ff8fab"] },
  ],
  background(P, next) {
    let shapes = ""
    for (let i = 0; i < 16; i++) {
      const x = Math.floor(next() * W), y = Math.floor(next() * H), s = 18 + next() * 46, color = P.cols[Math.floor(next() * 3)]
      const type = i % 4
      if (type === 0) shapes += `<circle cx="${x}" cy="${y}" r="${r1(s)}" fill="${color}" stroke="${P.ink}" stroke-width="4"/>`
      else if (type === 1) shapes += `<path d="M${x} ${y} l${r1(s)} ${r1(s * 1.6)} l-${r1(s * 2)} 0 z" fill="${color}" stroke="${P.ink}" stroke-width="4" stroke-linejoin="round" transform="rotate(${Math.floor(next() * 360)} ${x} ${y})"/>`
      else if (type === 2) shapes += `<path d="M${x} ${y} q12 -26 24 0 t24 0 t24 0 t24 0" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round" transform="rotate(${Math.floor(next() * 60 - 30)} ${x} ${y})"/>`
      else shapes += `<path d="M${x - 16} ${y} h32 M${x} ${y - 16} v32" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/>`
    }
    return `<defs><pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.2" fill="${P.ink}" opacity=".16"/></pattern></defs><rect width="${W}" height="${H}" fill="${P.bg}"/><rect width="${W}" height="${H}" fill="url(#dots)"/>${shapes}`
  },
  item(P, item, i) {
    const side = item.size * 1.28
    const turn = [-4, 3, -2, 5, -5][i % 5]
    const x = r1(item.x - side / 2), y = r1(item.y - side / 2)
    return `<g transform="rotate(${turn} ${item.x} ${item.y})"><rect x="${x + 11}" y="${y + 11}" width="${r1(side)}" height="${r1(side)}" rx="24" fill="${P.ink}"/><rect x="${x}" y="${y}" width="${r1(side)}" height="${r1(side)}" rx="24" fill="${P.cols[i % 3]}" stroke="${P.ink}" stroke-width="5"/>${glyph(item.name, item.x, item.y, item.size * 0.86, P.ink, 2)}</g>`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.78, b.size * 0.78 + 14)
    return `<path d="M${s.x1} ${s.y1} L${s.x2} ${s.y2}" stroke="${P.ink}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 17"/><path d="M${r1(s.x2 + s.ux * 16)} ${r1(s.y2 + s.uy * 16)} L${r1(s.x2 - s.uy * 13)} ${r1(s.y2 + s.ux * 13)} L${r1(s.x2 + s.uy * 13)} ${r1(s.y2 - s.ux * 13)} Z" fill="${P.ink}"/>`
  },
  mark(P, mark) {
    if (mark.step) return `<circle cx="${mark.x + 5}" cy="${mark.y + 5}" r="26" fill="${P.ink}"/><circle cx="${mark.x}" cy="${mark.y}" r="26" fill="${P.cols[1]}" stroke="${P.ink}" stroke-width="4"/><text x="${mark.x}" y="${mark.y + 10}" text-anchor="middle" ${sans} font-size="28" font-weight="700" fill="${P.ink}">${mark.text}</text>`
    let star = ""
    for (let k = 0; k < 24; k++) { const radius = k % 2 ? 62 : 84, angle = k * Math.PI / 12; star += `${r1(mark.x + Math.cos(angle) * radius)},${r1(mark.y + Math.sin(angle) * radius)} ` }
    return `<polygon points="${star}" fill="${P.cols[1]}" stroke="${P.ink}" stroke-width="5" stroke-linejoin="round"/><text x="${mark.x}" y="${mark.y + 16}" text-anchor="middle" ${sans} font-size="46" font-weight="700" fill="${P.ink}">VS</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x + 13}" y="${win.y + 13}" width="${win.w}" height="${win.h}" rx="16" fill="${P.ink}"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="16" fill="#fff" stroke="${P.ink}" stroke-width="5"/><path d="M${win.x} ${win.y + 54} h${win.w}" stroke="${P.ink}" stroke-width="5"/>${[0, 1, 2].map((d) => `<circle cx="${win.x + 30 + d * 26}" cy="${win.y + 28}" r="8" fill="${[P.cols[1], P.cols[2], P.bg][d]}" stroke="${P.ink}" stroke-width="3"/>`).join("")}${codeLines(win, [P.ink, P.cols[1], P.cols[2], P.bg], next, P.cols[1])}${badge(win, P.cols[1], P.ink, `stroke="${P.ink}" stroke-width="5"`)}`
  },
}

const blueprint = {
  palettes: [
    { bg: "#0b3d91", line: "#bcd6ff" },
    { bg: "#0f4c5c", line: "#b5ecf5" },
    { bg: "#27324d", line: "#c3cfff" },
    { bg: "#4a2466", line: "#ecc8ff" },
  ],
  background(P, next) {
    return `<defs><pattern id="minor" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0 H0 V30" fill="none" stroke="${P.line}" stroke-width="1" opacity=".16"/></pattern><pattern id="major" width="150" height="150" patternUnits="userSpaceOnUse"><path d="M150 0 H0 V150" fill="none" stroke="${P.line}" stroke-width="1.5" opacity=".3"/></pattern></defs><rect width="${W}" height="${H}" fill="${P.bg}"/><rect width="${W}" height="${H}" fill="url(#minor)"/><rect width="${W}" height="${H}" fill="url(#major)"/><rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke="${P.line}" stroke-width="2.5"/><g stroke="${P.line}" stroke-width="1.5" fill="${P.bg}"><rect x="${W - 326}" y="${H - 96}" width="300" height="70"/><path d="M${W - 326} ${H - 61} h300 M${W - 176} ${H - 96} v70" fill="none"/></g><g ${mono} font-size="13" fill="${P.line}"><text x="${W - 314}" y="${H - 73}">DRAWING ${String(Math.floor(next() * 900 + 100))}</text><text x="${W - 164}" y="${H - 73}">SCALE 1:${1 + Math.floor(next() * 8)}</text><text x="${W - 314}" y="${H - 38}">AAKASH4DEV.COM</text><text x="${W - 164}" y="${H - 38}">REV ${"ABCDEF"[Math.floor(next() * 6)]}</text></g>`
  },
  item(P, item, i) {
    const radius = r1(item.size * 0.72)
    const { x, y } = item
    const ticks = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy]) => `M${x + dx * (radius - 8)} ${y + dy * (radius - 8)} L${x + dx * (radius + 16)} ${y + dy * (radius + 16)}`).join(" ")
    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${P.bg}" fill-opacity=".72" stroke="${P.line}" stroke-width="2" stroke-dasharray="${item.main ? "none" : "9 7"}"/>${item.main ? `<circle cx="${x}" cy="${y}" r="${radius + 12}" fill="none" stroke="${P.line}" stroke-width="1" stroke-dasharray="3 6"/>` : ""}<path d="${ticks}" stroke="${P.line}" stroke-width="2"/>${glyph(item.name, x, y, item.size * 0.9, "#ffffff", 1.25)}<text x="${x + radius * 0.75}" y="${y - radius * 0.82}" ${mono} font-size="13" fill="${P.line}">${"ABCDE"[i]}${i + 1} · ${x},${y}</text>`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.72 + 20, b.size * 0.72 + 20)
    const tick = (px, py) => `M${r1(px - s.uy * 9)} ${r1(py + s.ux * 9)} L${r1(px + s.uy * 9)} ${r1(py - s.ux * 9)}`
    return `<path d="M${s.x1} ${s.y1} L${s.x2} ${s.y2} ${tick(s.x1, s.y1)} ${tick(s.x2, s.y2)}" stroke="${P.line}" stroke-width="1.8" fill="none"/><circle cx="${r1((s.x1 + s.x2) / 2)}" cy="${r1((s.y1 + s.y2) / 2)}" r="5" fill="${P.line}"/>`
  },
  mark(P, mark) {
    const half = mark.step ? 20 : 44
    return `<rect x="${mark.x - half}" y="${mark.y - half}" width="${half * 2}" height="${half * 2}" fill="${P.bg}" stroke="${P.line}" stroke-width="2"/><text x="${mark.x}" y="${mark.y + half * 0.3}" text-anchor="middle" ${mono} font-size="${half * 0.8}" font-weight="700" fill="#fff">${mark.text}</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="${P.bg}" fill-opacity=".8" stroke="${P.line}" stroke-width="2.5"/><rect x="${win.x + 8}" y="${win.y + 8}" width="${win.w - 16}" height="${win.h - 16}" fill="none" stroke="${P.line}" stroke-dasharray="4 6" opacity=".6"/><path d="M${win.x} ${win.y + 54} h${win.w}" stroke="${P.line}" stroke-width="2"/><text x="${win.x + 24}" y="${win.y + 35}" ${mono} font-size="17" fill="#fff">SOURCE FILE</text>${codeLines(win, ["#ffffff", P.line, P.line], next, "#ffffff").replaceAll('rx="5.5" fill=', 'rx="5.5" fill-opacity=".85" fill=')}${badge(win, "#ffffff", P.bg)}`
  },
}

const glass = {
  palettes: [
    { bg: "#0f172a", blobs: ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b"] },
    { bg: "#1e1b4b", blobs: ["#22d3ee", "#a3e635", "#e879f9", "#fb7185"] },
    { bg: "#052e2b", blobs: ["#34d399", "#fde047", "#38bdf8", "#f472b6"] },
    { bg: "#3b0a2a", blobs: ["#fb7185", "#fbbf24", "#818cf8", "#2dd4bf"] },
  ],
  background(P, next) {
    let blobs = ""
    for (let i = 0; i < 6; i++) blobs += `<circle cx="${Math.floor(next() * W)}" cy="${Math.floor(next() * H)}" r="${Math.floor(170 + next() * 150)}" fill="${P.blobs[i % 4]}" opacity=".8" filter="url(#haze)"/>`
    let rings = ""
    for (let i = 0; i < 5; i++) rings += `<circle cx="${Math.floor(next() * W)}" cy="${Math.floor(next() * H)}" r="${Math.floor(20 + next() * 70)}" fill="none" stroke="#fff" stroke-width="1.5" opacity=".28"/>`
    return `<rect width="${W}" height="${H}" fill="${P.bg}"/>${blobs}${rings}`
  },
  item(P, item, i) {
    const side = r1(item.size * 1.34)
    const x = r1(item.x - side / 2), y = r1(item.y - side / 2), round = r1(item.size * 0.3)
    return `<g class="float" style="animation-delay:-${i * 1.3}s"><rect x="${x + 8}" y="${y + 18}" width="${side}" height="${side}" rx="${round}" fill="#000" opacity=".3" filter="url(#soft)"/><rect x="${x}" y="${y}" width="${side}" height="${side}" rx="${round}" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/><path d="M${x + round} ${y + 7} h${r1(side - round * 2)}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".75"/>${glyph(item.name, item.x, item.y, item.size * 0.82, "#ffffff", 1.5)}</g>`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.74, b.size * 0.74)
    const bend = 46
    return `<path class="dash" d="M${s.x1} ${s.y1} Q${r1((s.x1 + s.x2) / 2 - s.uy * bend)} ${r1((s.y1 + s.y2) / 2 + s.ux * bend)} ${s.x2} ${s.y2}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 11" fill="none" opacity=".85"/>`
  },
  mark(P, mark) {
    const half = mark.step ? 21 : 46
    return `<rect x="${mark.x - half * 1.3}" y="${mark.y - half}" width="${half * 2.6}" height="${half * 2}" rx="${half}" fill="#fff" opacity=".94"/><text x="${mark.x}" y="${mark.y + half * 0.33}" text-anchor="middle" ${sans} font-size="${half * 0.9}" font-weight="700" fill="${P.bg}">${mark.text}</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x + 10}" y="${win.y + 22}" width="${win.w}" height="${win.h}" rx="26" fill="#000" opacity=".3" filter="url(#soft)"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="26" fill="#fff" fill-opacity=".13" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/>${[0, 1, 2].map((d) => `<circle cx="${win.x + 34 + d * 24}" cy="${win.y + 30}" r="7" fill="#fff" opacity="${0.9 - d * 0.25}"/>`).join("")}${codeLines(win, ["#ffffff", "#ffffffaa", P.blobs[0], P.blobs[3]], next, "#ffffff")}${badge(win, "#ffffff", P.bg)}`
  },
}

const paper = {
  palettes: [
    { bg: "#fdf6e3", ink: "#2b2d42", cols: ["#ef476f", "#06d6a0", "#118ab2", "#ffd166"] },
    { bg: "#eaf2ff", ink: "#1b2a4e", cols: ["#5b8def", "#ff7aa2", "#ffc145", "#3ecf8e"] },
    { bg: "#fff0f3", ink: "#3d1f2b", cols: ["#ff5d8f", "#7b61ff", "#00b8a9", "#f8b500"] },
    { bg: "#eefbf3", ink: "#17352a", cols: ["#2dbf7c", "#ff8a5b", "#4f7cff", "#ffd23f"] },
  ],
  background(P, next) {
    const hill = (base, height, color, phase) => {
      let d = `M0 ${H} L0 ${base}`
      for (let x = 0; x <= W; x += 40) d += ` L${x} ${r1(base - Math.sin(x / 150 + phase) * height - Math.sin(x / 61 + phase * 2) * height * 0.3)}`
      return `<path d="${d} L${W} ${H} Z" fill="${P.ink}" opacity=".12" transform="translate(0 -9)"/><path d="${d} L${W} ${H} Z" fill="${color}"/>`
    }
    const sunX = Math.floor(160 + next() * 880)
    let clouds = ""
    for (let i = 0; i < 4; i++) { const x = Math.floor(next() * 1000), y = Math.floor(40 + next() * 170), w = Math.floor(90 + next() * 90); clouds += `<rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="#fff"/><rect x="${x + 26}" y="${y - 16}" width="${Math.floor(w * 0.5)}" height="30" rx="15" fill="#fff"/>` }
    return `<rect width="${W}" height="${H}" fill="${P.bg}"/><circle cx="${sunX}" cy="150" r="118" fill="${P.cols[3]}" opacity=".45"/><circle cx="${sunX}" cy="150" r="78" fill="${P.cols[3]}"/>${clouds}${hill(455, 34, P.cols[2], next() * 6)}${hill(510, 28, P.cols[1], next() * 6)}${hill(565, 22, P.cols[0], next() * 6)}`
  },
  item(P, item, i) {
    const radius = r1(item.size * 0.7)
    return `<circle cx="${item.x + 7}" cy="${item.y + 10}" r="${radius}" fill="${P.ink}" opacity=".2"/><circle cx="${item.x}" cy="${item.y}" r="${radius}" fill="${P.cols[i % 4]}"/><circle cx="${item.x + 3}" cy="${item.y + 5}" r="${r1(radius * 0.8)}" fill="${P.ink}" opacity=".16"/><circle cx="${item.x}" cy="${item.y}" r="${r1(radius * 0.8)}" fill="#fff"/>${glyph(item.name, item.x, item.y, item.size * 0.74, P.ink, 1.9)}`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.74, b.size * 0.74)
    return `<path d="M${s.x1} ${s.y1} Q${r1((s.x1 + s.x2) / 2 + s.uy * 40)} ${r1((s.y1 + s.y2) / 2 - s.ux * 40)} ${s.x2} ${s.y2}" stroke="${P.ink}" stroke-width="4" stroke-linecap="round" stroke-dasharray="12 12" fill="none"/>`
  },
  mark(P, mark) {
    const radius = mark.step ? 23 : 52
    return `<circle cx="${mark.x + 4}" cy="${mark.y + 6}" r="${radius}" fill="${P.ink}" opacity=".2"/><circle cx="${mark.x}" cy="${mark.y}" r="${radius}" fill="${P.ink}"/><text x="${mark.x}" y="${mark.y + radius * 0.3}" text-anchor="middle" ${sans} font-size="${radius * 0.82}" font-weight="700" fill="#fff">${mark.text}</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x + 9}" y="${win.y + 12}" width="${win.w}" height="${win.h}" rx="20" fill="${P.ink}" opacity=".2"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="20" fill="#fff"/><path d="M${win.x} ${win.y + 54} v-34 a20 20 0 0 1 20 -20 h${win.w - 40} a20 20 0 0 1 20 20 v34 z" fill="${P.cols[0]}"/>${[0, 1, 2].map((d) => `<circle cx="${win.x + 30 + d * 24}" cy="${win.y + 27}" r="7" fill="#fff" opacity="${1 - d * 0.25}"/>`).join("")}${codeLines(win, [P.ink, P.cols[0], P.cols[1], P.cols[2]], next, P.cols[3])}${badge(win, P.ink, "#ffffff")}`
  },
}

const retro = {
  palettes: [
    { sky: ["#2b1055", "#d53369"], sun: ["#ffd319", "#ff2975"], ink: "#fdf0d5", line: "#f72585", dark: "#150a2e" },
    { sky: ["#0f0c29", "#1f6f8b"], sun: ["#f9f871", "#ff9671"], ink: "#effffb", line: "#00e5ff", dark: "#07111f" },
    { sky: ["#200122", "#6f0000"], sun: ["#fff75e", "#ff4800"], ink: "#fff4e0", line: "#ffb703", dark: "#16020f" },
    { sky: ["#141e30", "#5b3a8c"], sun: ["#ffe29f", "#ff719a"], ink: "#f8f0ff", line: "#b388ff", dark: "#0c1020" },
  ],
  background(P, next) {
    const sunX = Math.floor(380 + next() * 440)
    let cuts = ""
    for (let i = 0; i < 6; i++) cuts += `<rect x="${sunX - 230}" y="${300 + i * 26}" width="460" height="${5 + i * 2.6}" fill="${P.sky[1]}"/>`
    const range = (base, height, opacity) => { let d = `M0 ${base}`; for (let x = 0; x <= W; x += 100) d += ` L${x + 50} ${r1(base - height * (0.35 + next() * 0.65))} L${x + 100} ${base}`; return `<path d="${d} L${W} ${base + 40} L0 ${base + 40} Z" fill="${P.dark}" opacity="${opacity}"/>` }
    let grid = ""
    for (let i = -12; i <= 12; i++) grid += `<line x1="${600 + i * 40}" y1="440" x2="${600 + i * 230}" y2="${H}"/>`
    for (let i = 1; i <= 7; i++) { const y = r1(440 + (H - 440) * (i / 7) ** 1.7); grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>` }
    let stars = ""
    for (let i = 0; i < 34; i++) stars += `<circle class="${i % 3 ? "" : "twinkle"}" cx="${Math.floor(next() * W)}" cy="${Math.floor(next() * 230)}" r="${r1(0.8 + next() * 1.7)}" fill="${P.ink}" opacity="${r1(0.3 + next() * 0.6)}"/>`
    return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".72" stop-color="${P.sky[1]}"/></linearGradient><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sun[0]}"/><stop offset="1" stop-color="${P.sun[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sky)"/>${stars}<circle cx="${sunX}" cy="290" r="205" fill="url(#sun)"/>${cuts}${range(440, 120, 0.55)}${range(440, 70, 1)}<rect y="440" width="${W}" height="${H - 440}" fill="${P.dark}"/><g stroke="${P.line}" stroke-width="1.6" opacity=".75">${grid}</g>`
  },
  item(P, item, i) {
    const hexagon = (radius) => [0, 1, 2, 3, 4, 5].map((k) => `${r1(item.x + Math.cos(Math.PI / 3 * k + Math.PI / 6) * radius)},${r1(item.y + Math.sin(Math.PI / 3 * k + Math.PI / 6) * radius)}`).join(" ")
    const radius = item.size * 0.76
    return `<polygon points="${hexagon(radius + 11)}" fill="none" stroke="${P.line}" stroke-width="2.5" opacity=".85"/><polygon points="${hexagon(radius)}" fill="${P.dark}" fill-opacity=".86" stroke="${P.ink}" stroke-width="3.5" stroke-linejoin="round"/>${glyph(item.name, item.x, item.y, item.size * 0.82, i % 2 ? P.sun[0] : P.ink, 1.7)}`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.76 + 12, b.size * 0.76 + 12)
    return `<path d="M${s.x1} ${s.y1} L${s.x2} ${s.y2}" stroke="${P.dark}" stroke-width="9" stroke-linecap="round"/><path class="dash" d="M${s.x1} ${s.y1} L${s.x2} ${s.y2}" stroke="${P.sun[0]}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 10"/>`
  },
  mark(P, mark) {
    const half = mark.step ? 26 : 60
    return `<polygon points="${mark.x},${mark.y - half} ${mark.x + half},${mark.y} ${mark.x},${mark.y + half} ${mark.x - half},${mark.y}" fill="${P.line}" stroke="${P.ink}" stroke-width="3"/><text x="${mark.x}" y="${mark.y + half * 0.23}" text-anchor="middle" ${sans} font-size="${half * 0.62}" font-weight="700" fill="${P.dark}">${mark.text}</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x - 9}" y="${win.y - 9}" width="${win.w + 18}" height="${win.h + 18}" rx="8" fill="none" stroke="${P.line}" stroke-width="2.5"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="4" fill="${P.dark}" fill-opacity=".9" stroke="${P.ink}" stroke-width="3.5"/><path d="M${win.x} ${win.y + 54} h${win.w}" stroke="${P.ink}" stroke-width="3"/>${[0, 1, 2].map((d) => `<rect x="${win.x + 22 + d * 26}" y="${win.y + 19}" width="16" height="16" fill="${[P.sun[0], P.sun[1], P.line][d]}"/>`).join("")}${codeLines(win, [P.ink, P.sun[0], P.sun[1], P.line], next, P.line)}${badge(win, P.sun[0], P.dark)}`
  },
}

const terminal = {
  palettes: [
    { bg: "#07110b", fg: "#4ade80" },
    { bg: "#120d03", fg: "#fbbf24" },
    { bg: "#04121a", fg: "#22d3ee" },
    { bg: "#160716", fg: "#f472b6" },
  ],
  background(P, next, post) {
    const hex = () => Math.floor(next() * 65536).toString(16).padStart(4, "0")
    let columns = ""
    for (let row = 0; row < 15; row++) columns += `<text x="46" y="${138 + row * 30}">${hex()} ${hex()}</text><text x="${W - 46}" y="${138 + row * 30}" text-anchor="end">${hex()} ${hex()}</text>`
    const corner = (x, y, dx, dy) => `M${x} ${y + dy * 46} V${y} H${x + dx * 46}`
    return `<defs><pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="${P.fg}" opacity=".07"/></pattern></defs><rect width="${W}" height="${H}" fill="${P.bg}"/><ellipse cx="600" cy="315" rx="560" ry="290" fill="${P.fg}" opacity=".1" filter="url(#haze)"/><rect width="${W}" height="${H}" fill="url(#scan)"/><path d="${corner(22, 22, 1, 1)} ${corner(W - 22, 22, -1, 1)} ${corner(22, H - 22, 1, -1)} ${corner(W - 22, H - 22, -1, -1)}" fill="none" stroke="${P.fg}" stroke-width="4"/><g ${mono} font-size="15" fill="${P.fg}" opacity=".3">${columns}</g><g ${mono} font-size="19" fill="${P.fg}"><text x="46" y="72">$ open ${escape(post.id)}</text><rect class="blink" x="${46 + (7 + post.id.length) * 11.6}" y="56" width="11" height="20"/><text x="46" y="${H - 44}" opacity=".7">[ ${escape(post.category.toLowerCase())} ]</text><text x="${W - 46}" y="${H - 44}" text-anchor="end" opacity=".7">${escape(post.tags.slice(0, 2).join(" · ").toLowerCase())}</text></g>`
  },
  item(P, item) {
    const half = r1(item.size * 0.68), arm = r1(item.size * 0.22)
    const corner = (dx, dy) => `M${item.x + dx * half} ${item.y + dy * (half - arm)} V${item.y + dy * half} H${item.x + dx * (half - arm)}`
    return `<rect x="${item.x - half}" y="${item.y - half}" width="${half * 2}" height="${half * 2}" fill="${P.bg}" opacity=".78"/><path d="${corner(-1, -1)} ${corner(1, -1)} ${corner(-1, 1)} ${corner(1, 1)}" fill="none" stroke="${P.fg}" stroke-width="${item.main ? 5 : 3.5}"/>${glyph(item.name, item.x, item.y, item.size * 0.88, P.fg, 2.6, `opacity=".5" filter="url(#glow)"`)}${glyph(item.name, item.x, item.y, item.size * 0.88, P.fg, 1.5)}`
  },
  link(P, a, b) {
    const s = between(a, b, a.size * 0.68 + 14, b.size * 0.68 + 14)
    return `<path class="dash" d="M${s.x1} ${s.y1} L${s.x2} ${s.y2}" stroke="${P.fg}" stroke-width="6" stroke-dasharray="6 13" fill="none"/>`
  },
  mark(P, mark) {
    const size = mark.step ? 24 : 46
    return `<rect x="${mark.x - size * 1.3}" y="${mark.y - size * 0.8}" width="${size * 2.6}" height="${size * 1.6}" fill="${P.bg}"/><text x="${mark.x}" y="${mark.y + size * 0.36}" text-anchor="middle" ${mono} font-size="${size}" font-weight="700" fill="${P.fg}">[${mark.text}]</text>`
  },
  window(P, win, next) {
    return `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" fill="${P.bg}" fill-opacity=".9" stroke="${P.fg}" stroke-width="3"/><rect x="${win.x}" y="${win.y}" width="${win.w}" height="54" fill="${P.fg}"/><text x="${win.x + 22}" y="${win.y + 35}" ${mono} font-size="19" font-weight="700" fill="${P.bg}">~/src/main.${escape(win.language.toLowerCase().replace("node", "js").replace("c++", "cpp").replace("java", "java"))}</text>${codeLines(win, [P.fg], next, P.fg).replaceAll('rx="5.5" fill=', `rx="0" opacity="${0.75}" fill=`)}`
  },
}

const styles = [neon, sticker, blueprint, glass, paper, retro, terminal]
const motion = `<style>.float{animation:float 6s ease-in-out infinite}.dash{animation:dash 1.6s linear infinite}.twinkle{animation:twinkle 3.4s ease-in-out infinite}.blink{animation:twinkle 1.2s steps(2) infinite}@keyframes float{50%{transform:translateY(-8px)}}@keyframes dash{to{stroke-dashoffset:-38}}@keyframes twinkle{50%{opacity:.1}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>`
const filters = `<defs><filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter><filter id="haze" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="75"/></filter></defs>`

function drawCover(post, index) {
  if (!post.cover) throw new Error(`No cover scene defined for: ${post.id}`)
  const [kind, ...words] = post.cover.split(/\s+/)
  const expected = { hero: 5, flow: 3, versus: 2, code: 2 }[kind]
  if (!expected || words.length !== expected) throw new Error(`Bad cover scene for ${post.id}: "${post.cover}"`)
  const parts = kind === "hero" ? [words[0], words.slice(1)] : words
  const next = random(post.id)
  // Neighbours in the blog grid (3 columns) always get different styles; the palette changes every time a style repeats.
  const style = styles[index % styles.length]
  const P = style.palettes[Math.floor(index / styles.length) % style.palettes.length]
  const layout = arrange(kind, parts, next)
  let body = style.background(P, next, post)
  if (layout.divider) body += layout.divider === "straight" ? `<path d="M600 60 V570" stroke="${P.ink || P.line || P.fg || "#fff"}" stroke-width="3" stroke-dasharray="4 14" opacity=".6"/>` : `<path d="M760 40 L440 590" stroke="${P.ink || P.line || P.fg || "#fff"}" stroke-width="3" stroke-dasharray="4 14" opacity=".6"/>`
  layout.links.forEach(([from, to], i) => { body += style.link(P, layout.items[from], layout.items[to], i) })
  if (layout.window) body += style.window(P, layout.window, next)
  layout.items.forEach((item, i) => { body += style.item(P, item, i) })
  layout.marks.forEach((mark) => { body += style.mark(P, mark) })
  // Faded name across the middle of every cover: dark on the light styles, white on the dark ones.
  const lightStyle = style === sticker || style === paper
  body += `<text x="${W / 2}" y="${H / 2 + 24}" text-anchor="middle" ${sans} font-size="68" font-weight="700" letter-spacing="6" fill="${lightStyle ? "#000000" : "#ffffff"}" opacity="${lightStyle ? 0.13 : 0.17}">AAKASH SINGH RAJPUT</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title"><title id="title">Illustration for: ${escape(post.title)}</title>${motion}${filters}${body}</svg>`
}

const directory = path.join(__dirname, "../public/blogs/generated")
fs.mkdirSync(directory, { recursive: true })
const posts = blogPosts.filter((post) => post.image.startsWith("/blogs/generated/"))
// Remove covers of articles that no longer exist.
const wanted = new Set(posts.flatMap((post) => [`${post.id}.svg`, `${post.id}.png`]))
for (const file of fs.readdirSync(directory)) if (!wanted.has(file)) fs.unlinkSync(path.join(directory, file))
const previews = []
posts.forEach((post, index) => {
  const svg = drawCover(post, index)
  fs.writeFileSync(path.join(directory, `${post.id}.svg`), svg)
  previews.push(sharp(Buffer.from(svg)).png({ palette: true, quality: 80, effort: 7 }).toFile(path.join(directory, `${post.id}.png`)))
})
Promise.all(previews).then(() => console.log(`Generated ${posts.length} illustrated covers (SVG) and ${posts.length} PNG social previews.`)).catch((error) => { console.error(error); process.exitCode = 1 })
