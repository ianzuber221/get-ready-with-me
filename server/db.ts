import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"
import { MongoClient, type Db } from "mongodb"

export type StreamDoc = {
  _id: string
  title: string
  day: number // 0=Sun … 6=Sat
  startHour: number // 0–23
  durationHours: number
  vibe: string
  notes: string
  color: string
}

type Store = { streams: StreamDoc[] }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, "../data")
const mockPath = path.join(dataDir, "streams.json")

const seedStreams: StreamDoc[] = [
  {
    _id: "seed-1",
    title: "Soft reset GRWM",
    day: 1,
    startHour: 19,
    durationHours: 1.5,
    vibe: "cozy chat",
    notes: "Skincare + playlist reveal",
    color: "#FF6B6B",
  },
  {
    _id: "seed-2",
    title: "Collab try-on",
    day: 3,
    startHour: 18,
    durationHours: 2,
    vibe: "fashion",
    notes: "Guest drop-in second hour",
    color: "#FFD93D",
  },
  {
    _id: "seed-3",
    title: "Friday night chat",
    day: 5,
    startHour: 20,
    durationHours: 2,
    vibe: "just chatting",
    notes: "Q&A + snack tour",
    color: "#6BCB77",
  },
  {
    _id: "seed-4",
    title: "Sunday unwind",
    day: 0,
    startHour: 16,
    durationHours: 1,
    vibe: "cozy chat",
    notes: "Low-energy, candles on",
    color: "#4D96FF",
  },
]

function ensureMockFile(): Store {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(mockPath)) {
    const store: Store = { streams: seedStreams }
    fs.writeFileSync(mockPath, JSON.stringify(store, null, 2))
    return store
  }
  return JSON.parse(fs.readFileSync(mockPath, "utf8")) as Store
}

function writeMock(store: Store) {
  fs.writeFileSync(mockPath, JSON.stringify(store, null, 2))
}

export type StreamStore = {
  mode: "file-mock" | "mongodb"
  listStreams(): Promise<StreamDoc[]>
  getStream(id: string): Promise<StreamDoc | null>
  createStream(input: Omit<StreamDoc, "_id">): Promise<StreamDoc>
  updateStream(
    id: string,
    patch: Partial<Omit<StreamDoc, "_id">>,
  ): Promise<StreamDoc | null>
  deleteStream(id: string): Promise<boolean>
}

/** File-backed mock with the same method shapes we use against Mongo. */
export function createFileStore(): StreamStore {
  return {
    mode: "file-mock",
    async listStreams(): Promise<StreamDoc[]> {
      return ensureMockFile().streams
    },
    async getStream(id: string): Promise<StreamDoc | null> {
      return ensureMockFile().streams.find((s) => s._id === id) ?? null
    },
    async createStream(
      input: Omit<StreamDoc, "_id">,
    ): Promise<StreamDoc> {
      const store = ensureMockFile()
      const doc: StreamDoc = { ...input, _id: randomUUID() }
      store.streams.push(doc)
      writeMock(store)
      return doc
    },
    async updateStream(
      id: string,
      patch: Partial<Omit<StreamDoc, "_id">>,
    ): Promise<StreamDoc | null> {
      const store = ensureMockFile()
      const idx = store.streams.findIndex((s) => s._id === id)
      if (idx < 0) return null
      store.streams[idx] = { ...store.streams[idx], ...patch }
      writeMock(store)
      return store.streams[idx]
    },
    async deleteStream(id: string): Promise<boolean> {
      const store = ensureMockFile()
      const before = store.streams.length
      store.streams = store.streams.filter((s) => s._id !== id)
      writeMock(store)
      return store.streams.length < before
    },
  }
}

/** Real Mongo adapter — same interface as the file mock. */
export function createMongoStore(db: Db): StreamStore {
  const col = db.collection<StreamDoc>("streams")
  return {
    mode: "mongodb",
    async listStreams() {
      return col.find({}).toArray() as Promise<StreamDoc[]>
    },
    async getStream(id) {
      return (await col.findOne({ _id: id })) as StreamDoc | null
    },
    async createStream(input) {
      const doc: StreamDoc = { ...input, _id: randomUUID() }
      await col.insertOne(doc)
      return doc
    },
    async updateStream(id, patch) {
      const result = await col.findOneAndUpdate(
        { _id: id },
        { $set: patch },
        { returnDocument: "after" },
      )
      return (result as StreamDoc | null) ?? null
    },
    async deleteStream(id) {
      const result = await col.deleteOne({ _id: id })
      return result.deletedCount > 0
    },
  }
}

export async function connectStore(): Promise<StreamStore> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log("No MONGODB_URI — using file-backed mock at data/streams.json")
    const store = createFileStore()
    // ensure seed exists
    await store.listStreams()
    return store
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()
    const dbName = process.env.MONGODB_DB || "get_ready_with_me"
    const db = client.db(dbName)
    const store = createMongoStore(db)
    const existing = await store.listStreams()
    if (existing.length === 0) {
      for (const s of seedStreams) {
        await db.collection("streams").insertOne(s)
      }
    }
    console.log(`Connected to MongoDB db=${dbName}`)
    return store
  } catch (err) {
    console.warn("Mongo connect failed — falling back to file mock", err)
    return createFileStore()
  }
}
