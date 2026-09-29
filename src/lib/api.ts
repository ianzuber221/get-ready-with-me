export type Stream = {
  _id: string
  title: string
  day: number
  startHour: number
  durationHours: number
  vibe: string
  notes: string
  color: string
}

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8788"

export async function fetchStreams(): Promise<Stream[]> {
  const res = await fetch(`${API}/api/streams`)
  if (!res.ok) throw new Error("Could not load streams")
  return res.json()
}

export async function updateStream(
  _id: string,
  _patch: Partial<Stream>,
): Promise<Stream> {
  // TODO(your-name): Step 2 — PATCH /api/streams/:id with JSON body; throw if !res.ok.
  throw new Error("updateStream not implemented — YOUR_FEATURE.md step 2")
}

export async function fetchTonight(): Promise<Stream[]> {
  // TODO(your-name): Step 4 — GET /api/tonight once the route (step 4 API) returns data.
  throw new Error("fetchTonight not implemented — YOUR_FEATURE.md step 4")
}

export async function createStream(
  _payload: Omit<Stream, "_id">,
): Promise<Stream> {
  // TODO(your-name): Step 5 — POST /api/streams; return created doc.
  throw new Error("createStream not implemented — YOUR_FEATURE.md step 5")
}

export async function deleteStream(_id: string): Promise<void> {
  // TODO(your-name): Step 5 — DELETE /api/streams/:id.
  throw new Error("deleteStream not implemented — YOUR_FEATURE.md step 5")
}
