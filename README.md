# Get Ready With Me — Stream Scheduler

Week planner for stream nights. Express API with a Mongo-shaped store (file mock by default).

## Run

```bash
npm install
npm run dev
```

Starts API (`:8788`) + Vite (`:5176`). **No Mongo credentials required** — defaults to a file-backed mock (`data/streams.json`) with the same store API shape as Mongo.

## Point at real Mongo

```bash
cp .env.example .env
```

Set:

```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=get_ready_with_me
```

If the URI is missing or connection fails, the server falls back to the file mock automatically.

## What ships

- Week view shell with seed streams
- Connection layer (`server/db.ts`) — file mock **or** Mongo
- `GET /api/streams` (+ health, get by id)
- Tonight page with client-side fallback preview

## YOUR FEATURE

**Start here → [`YOUR_FEATURE.md`](./YOUR_FEATURE.md)**

Ownership checklist: goal, files, numbered steps, implementation notes, acceptance criteria, demo script, stretch.

In short: drag/reschedule → PATCH, `GET /api/tonight` + rundown, remaining create/edit/delete. Search for `TODO(your-name)` (each comment references a step number).

## Rename checklist

1. `src/config/site.ts`
2. `index.html` title + meta
3. `public/favicon.svg`
4. Optional `package.json` name
5. GitHub / Vercel display name

Visible branding should read from `siteConfig` only.

## Resume line

**Get Ready With Me** — Stream Scheduler (React, Express, MongoDB)

## License

MIT
