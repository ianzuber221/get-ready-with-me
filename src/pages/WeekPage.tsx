import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppNav } from "../components/AppNav"
import { EmptyState, ErrorState, LoadingState, WeekGrid } from "../components/ui"
import { siteConfig } from "../config/site"
import { fetchStreams, type Stream } from "../lib/api"

export function WeekPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Stream | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchStreams()
      .then((data) => {
        if (!cancelled) setStreams(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <AppNav />
      <section className="hero">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{siteConfig.name}</p>
        <h1 className="hero__headline">{siteConfig.tagline}</h1>
        <p className="hero__support">{siteConfig.description}</p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/tonight">
            Tonight&apos;s rundown
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>This week</h2>
          <p>
            Seed streams + list API are live. Drag/reschedule and CRUD are in{" "}
            <code>YOUR_FEATURE.md</code>.
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : streams.length === 0 ? (
          <EmptyState />
        ) : (
          <WeekGrid streams={streams} onSelect={setSelected} />
        )}

        {selected && (
          <aside className="detail-panel">
            <h3>{selected.title}</h3>
            <p>{selected.notes}</p>
            <p className="muted">
              Day {selected.day} · {selected.startHour}:00 · {selected.vibe}
            </p>
            {/* TODO(your-name): Step 6 — edit form (title/notes/time) + Step 5 delete button, both wired to API */}
          </aside>
        )}

        <div className="todo-callout">
          <strong>Your feature</strong>
          <p>
            Follow <code>YOUR_FEATURE.md</code> steps 1–6. Search{" "}
            <code>TODO(your-name)</code> for the exact spots.
          </p>
        </div>
      </section>
    </div>
  )
}
