import { siteConfig } from "../config/site"
import type { Stream } from "../lib/api"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function WeekGrid({
  streams,
  onSelect,
}: {
  streams: Stream[]
  onSelect?: (stream: Stream) => void
}) {
  const hours = Array.from({ length: 10 }, (_, i) => i + 14) // 2pm–11pm

  return (
    <div className="week" role="grid" aria-label="Week schedule">
      <div className="week__corner" />
      {DAYS.map((d) => (
        <div key={d} className="week__dayhead">
          {d}
        </div>
      ))}
      {hours.map((hour) => (
        <div key={hour} className="week__row">
          <div className="week__time">
            {hour > 12 ? hour - 12 : hour}
            {hour >= 12 ? "p" : "a"}
          </div>
          {DAYS.map((_, day) => {
            const cellStreams = streams.filter(
              (s) => s.day === day && Math.floor(s.startHour) === hour,
            )
            return (
              <div key={`${day}-${hour}`} className="week__cell">
                {cellStreams.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    className="stream-chip"
                    style={{ background: s.color }}
                    onClick={() => onSelect?.(s)}
                    // TODO(your-name): Step 3 — enable drag; on drop onto a cell, PATCH day/startHour via updateStream.
                    draggable={false}
                    title="Drag/reschedule is YOUR_FEATURE.md step 3"
                  >
                    <strong>{s.title}</strong>
                    <span>
                      {s.startHour}:00 · {s.durationHours}h
                    </span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__orb" aria-hidden />
      <p className="empty-state__title">No streams slotted</p>
      <p>{message ?? siteConfig.mascots.empty}</p>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <div className="loading-state__orb" aria-hidden />
      <p>{siteConfig.mascots.loading}</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__title">Couldn&apos;t reach the planner</p>
      <p>{message}</p>
      <p className="error-state__hint">
        Run <code>npm run dev</code> so the API (port 8788) starts with Vite.
      </p>
    </div>
  )
}
