/**
 * YOUR FEATURE — Tonight's rundown
 *
 * Full checklist: YOUR_FEATURE.md (especially step 4 + stretch).
 * Implement GET /api/tonight and fetchTonight(); this page already falls back client-side.
 */

import { useEffect, useState } from "react"
import { AppNav } from "../components/AppNav"
import { EmptyState, ErrorState, LoadingState } from "../components/ui"
import { siteConfig } from "../config/site"
import { fetchStreams, fetchTonight, type Stream } from "../lib/api"

export function TonightPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // Prefer the dedicated endpoint once you implement it.
        try {
          const tonight = await fetchTonight()
          if (!cancelled) {
            setStreams(tonight)
            setNote(null)
          }
        } catch {
          // Fallback preview using full list filtered client-side
          const all = await fetchStreams()
          const today = new Date().getDay()
          const tonight = all
            .filter((s) => s.day === today)
            .sort((a, b) => a.startHour - b.startHour)
          if (!cancelled) {
            setStreams(tonight)
            setNote(
              "Showing client-side filter — replace with GET /api/tonight when ready.",
            )
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <AppNav />
      <section className="section">
        <div className="section__head">
          <p className="eyebrow">{siteConfig.name}</p>
          <h1>Tonight&apos;s rundown</h1>
          <p>One card. What&apos;s on. What to prep. Go live looking ready.</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : streams.length === 0 ? (
          <EmptyState message="Nothing scheduled tonight — Poppy says take the night off or add a slot." />
        ) : (
          <article className="rundown">
            <header className="rundown__head">
              <h2>On air tonight</h2>
              <span>
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </header>
            <ol className="rundown__list">
              {streams.map((s) => (
                <li key={s._id}>
                  <span
                    className="rundown__dot"
                    style={{ background: s.color }}
                  />
                  <div>
                    <strong>{s.title}</strong>
                    <p>
                      {s.startHour}:00 · {s.durationHours}h · {s.vibe}
                    </p>
                    <p className="muted">{s.notes}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* TODO(your-name): Stretch — prep checklist per stream + countdown to first start */}
          </article>
        )}

        {note && <p className="status-msg">{note}</p>}

        <div className="todo-callout">
          <strong>Your feature</strong>
          <p>
            Steps 4 (+ stretch) in <code>YOUR_FEATURE.md</code>. Make{" "}
            <code>fetchTonight</code> succeed so this note goes away.
          </p>
        </div>
      </section>
    </div>
  )
}
