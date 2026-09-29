# YOUR FEATURE — Get Ready With Me (Stream Scheduler)

Welcome. The week grid, seed streams, and `GET /api/streams` already work. Your job is drag-to-reschedule, tonight’s rundown API, and the rest of CRUD.

---

## Goal

Ship a week scheduler where streams can be created, dragged to a new day/hour, edited, and deleted — plus a tonight’s rundown powered by `GET /api/tonight`. Resume-friendly: *“Implemented a week stream scheduler with Express and a Mongo-shaped store (file mock locally).”*

---

## Files to open

| Path | Why |
| --- | --- |
| `server/index.ts` | POST / PATCH / DELETE / tonight stubs (501) |
| `server/db.ts` | `store.createStream` / `updateStream` / `deleteStream` / `listStreams` — already implemented |
| `src/lib/api.ts` | `updateStream` / `fetchTonight` client stubs |
| `src/components/ui.tsx` | `WeekGrid` chips — drag handlers go here |
| `src/pages/WeekPage.tsx` | Detail panel — edit + delete UI |
| `src/pages/TonightPage.tsx` | Rundown card — prefers `fetchTonight`, falls back client-side |

Search for `TODO(your-name)`.

---

## Step-by-step tasks

1. **PATCH reschedule (API)** — Implement `PATCH /api/streams/:id` by calling `store.updateStream(id, patch)`. Accept at least `day` and `startHour` (also title/notes/etc. for the edit form). Return the updated doc or 404.

2. **Wire `updateStream`** — In `src/lib/api.ts`, `fetch` with method `PATCH` and a JSON body. Throw if `!res.ok`.

3. **Drag in the week view** — On stream chips in `WeekGrid`, enable `draggable` and handle drag-and-drop onto a day/hour cell. On drop, call `updateStream` with the new `day` + `startHour`, then refresh the streams list in `WeekPage` (lift state or pass an `onReschedule` callback).

4. **Tonight’s rundown (API + client)** — Implement `GET /api/tonight`: `listStreams()`, filter `day === new Date().getDay()`, sort by `startHour`. Wire `fetchTonight()` to that route. Confirm the yellow client-side note on `/tonight` disappears once the real endpoint works.

5. **Create + delete** — Implement `POST /api/streams` (`store.createStream`) and `DELETE /api/streams/:id` (`store.deleteStream`). Add matching client helpers and UI (e.g. “Add slot” + delete on the detail panel).

6. **Edit form** — In the `WeekPage` detail panel, add fields to edit title/notes/vibe/time and save via PATCH. Wire delete there too.

---

## Hints

- `store` methods in `server/db.ts` already work for both the file mock and Mongo — **call them**; don’t reimplement storage in the route.
- Day is `0–6` (`Date.getDay()`). Hours in the grid are roughly 14–23 (2pm–11pm).
- `TonightPage` already has a client-side fallback so you can design the card before the API is done — replace the fallback path by making `fetchTonight` succeed.
- Chip styles and the rundown card layout are in place; focus on behavior, not a redesign.
- Default API URL: `http://127.0.0.1:8788`.

---

## Acceptance criteria

You're done when…

- [ ] Dragging a stream to another cell updates day/hour in the store (survives refresh)
- [ ] `GET /api/tonight` returns tonight’s streams sorted by start time
- [ ] `/tonight` loads from that endpoint (no “client-side filter” note)
- [ ] You can create a new stream from the UI
- [ ] You can edit and delete a stream from the detail panel
- [ ] File mock at `data/streams.json` (or Mongo) reflects changes after restart

---

## Demo script

1. “Get Ready With Me is my stream-week planner — Express API with a Mongo-shaped store.”
2. “I can drag a slot to a new day and hour; that PATCHes the backend.”
3. “Tonight’s rundown hits a dedicated endpoint filtered to today’s weekday.”
4. “Create, edit, delete are wired too — here’s adding a quick prep stream.”
5. “Locally it uses a file mock; same store interface swaps to real Mongo with an env var.”

---

## Stretch

- Prep checklist + countdown to first start on the rundown card (`TonightPage` TODO).
- Conflict warning when two streams overlap on the same day/hour.
