import express from "express"
import cors from "cors"
import { connectStore, type StreamStore } from "./db.ts"

const app = express()
const PORT = Number(process.env.PORT) || 8788

app.use(cors())
app.use(express.json())

let store: StreamStore

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "get-ready-with-me",
    store: store?.mode ?? "starting",
  })
})

/** Shipped sample route — list streams for the week view. */
app.get("/api/streams", async (_req, res) => {
  const streams = await store.listStreams()
  res.json(streams)
})

app.get("/api/streams/:id", async (req, res) => {
  const doc = await store.getStream(req.params.id)
  if (!doc) {
    res.status(404).json({ error: "Not found" })
    return
  }
  res.json(doc)
})

/**
 * TODO(your-name): Step 5 — Create stream
 * Body: { title, day, startHour, durationHours, vibe, notes, color }
 * Call store.createStream — see server/db.ts.
 */
app.post("/api/streams", async (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 5 — store.createStream",
  })
})

/**
 * TODO(your-name): Step 1 — Reschedule / update (drag in week view → PATCH day + startHour)
 * Call store.updateStream(id, patch).
 */
app.patch("/api/streams/:id", async (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 1 — store.updateStream",
  })
})

/**
 * TODO(your-name): Step 5 — Delete stream via store.deleteStream
 */
app.delete("/api/streams/:id", async (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 5 — store.deleteStream",
  })
})

/**
 * TODO(your-name): Step 4 — Tonight's rundown
 * Filter listStreams() where day === new Date().getDay(), sort by startHour.
 */
app.get("/api/tonight", async (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 4 — filter by weekday + sort by startHour",
  })
})

async function main() {
  store = await connectStore()
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Get Ready With Me API on http://0.0.0.0:${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
