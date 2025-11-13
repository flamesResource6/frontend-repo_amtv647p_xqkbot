import { useEffect, useMemo, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search 500+ privacy-first tools..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
      {children}
    </span>
  )
}

function ToolCard({ tool, onOpen }) {
  return (
    <button onClick={() => onOpen(tool)} className="text-left group">
      <div className="p-4 rounded-xl border bg-white hover:shadow-lg transition-all">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
            {tool.name}
          </h3>
          <Badge>{tool.category}</Badge>
        </div>
        <p className="mt-2 text-gray-600 text-sm">{tool.description}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {tool.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-xl">⚡</span>
            <span className="font-bold text-gray-900">Free Tools Max</span>
          </div>
          <nav className="text-sm text-gray-600 flex items-center gap-4">
            <a href="#privacy" className="hover:text-gray-900">Privacy</a>
            <a href="#about" className="hover:text-gray-900">About</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
          No registration. No tracking. Your data stays in your browser.
        </div>
      </footer>
    </div>
  )
}

function TextCaseTool() {
  const [text, setText] = useState('')
  const toUpper = () => setText((t) => t.toUpperCase())
  const toLower = () => setText((t) => t.toLowerCase())
  const toTitle = () => setText((t) => t.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()))

  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full rounded-lg border p-3" placeholder="Paste or type text here..." />
      <div className="flex flex-wrap gap-2">
        <button onClick={toUpper} className="px-3 py-2 bg-blue-600 text-white rounded-lg">UPPERCASE</button>
        <button onClick={toLower} className="px-3 py-2 bg-blue-600 text-white rounded-lg">lowercase</button>
        <button onClick={toTitle} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Title Case</button>
        <button onClick={() => navigator.clipboard.writeText(text)} className="px-3 py-2 border rounded-lg">Copy</button>
        <button onClick={() => setText('')} className="px-3 py-2 border rounded-lg">Clear</button>
      </div>
    </div>
  )
}

function UrlEncoderTool() {
  const [src, setSrc] = useState('')
  const encoded = useMemo(() => {
    try { return encodeURIComponent(src) } catch { return '' }
  }, [src])
  const decoded = useMemo(() => {
    try { return decodeURIComponent(src) } catch { return '' }
  }, [src])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-600">Input</label>
        <textarea value={src} onChange={(e) => setSrc(e.target.value)} rows={6} className="w-full rounded-lg border p-3" />
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Encoded</label>
          <textarea value={encoded} readOnly rows={3} className="w-full rounded-lg border p-3 bg-gray-50" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Decoded</label>
          <textarea value={decoded} readOnly rows={3} className="w-full rounded-lg border p-3 bg-gray-50" />
        </div>
      </div>
    </div>
  )
}

function ImageResizerTool() {
  const [file, setFile] = useState(null)
  const [width, setWidth] = useState(800)
  const [quality, setQuality] = useState(0.8)
  const [outputUrl, setOutputUrl] = useState('')

  const handleResize = async () => {
    if (!file) return
    const img = new Image()
    img.src = URL.createObjectURL(file)
    await new Promise((res) => (img.onload = res))

    const ratio = img.width / img.height
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = Math.round(width / ratio)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    setOutputUrl(dataUrl)
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = outputUrl
    a.download = 'resized.jpg'
    a.click()
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Width</label>
        <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} className="w-28 border rounded px-2 py-1" />
        <label className="text-sm">Quality</label>
        <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
        <span className="text-sm text-gray-600">{Math.round(quality * 100)}%</span>
      </div>
      <button onClick={handleResize} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Resize</button>
      {outputUrl && (
        <div className="space-y-2">
          <img src={outputUrl} alt="preview" className="max-h-64 rounded border" />
          <button onClick={download} className="px-3 py-2 border rounded-lg">Download</button>
        </div>
      )}
    </div>
  )
}

const TOOL_COMPONENTS = {
  'text-case': TextCaseTool,
  'url-encoder': UrlEncoderTool,
  'image-resizer': ImageResizerTool,
}

export default function App() {
  const [query, setQuery] = useState('')
  const [tools, setTools] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/tools`)
        const json = await res.json()
        setTools(json)
      } catch (e) {
        setTools([])
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools
    return tools.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((x) => x.toLowerCase().includes(q))
    )
  }, [tools, query])

  const ActiveComponent = active ? TOOL_COMPONENTS[active.slug] : null

  return (
    <Layout>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">500+ Free Online Tools</h1>
        <p className="mt-2 text-gray-600">No registration. No personal data saved. Privacy-first utilities.</p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onOpen={setActive} />
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{active.name}</h3>
              <button onClick={() => setActive(null)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            {ActiveComponent ? <ActiveComponent /> : (
              <div className="text-gray-600">This tool will be available soon.</div>
            )}
          </div>
        </div>
      )}

      <section id="privacy" className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Privacy</h2>
        <p className="text-gray-600">We don’t store your input. Wherever possible, tools run entirely in your browser. No account required.</p>
      </section>

      <section id="about" className="mt-10">
        <h2 className="text-2xl font-bold mb-2">About</h2>
        <p className="text-gray-600">A curated hub of quick utilities designed to respect your privacy and save time. We’ll keep adding more tools regularly.</p>
      </section>
    </Layout>
  )
}
