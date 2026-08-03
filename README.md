# Plain Pipeline

A lean CRM and planner: leads with next actions, a drag-and-drop task board, and
short/long-term goals with progress tracking. Built with Next.js, Tailwind CSS,
and SQLite — no external database required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000, create an account, and go. Data is stored in
`data/plain-pipeline.db` (ignored by git).

## Deploy to Railway

1. Push this repo to GitHub and create a new Railway project from it. Railway
   detects Next.js automatically — no build settings needed.
2. **Important — add a volume** so your data survives deploys: in your Railway
   service, click **⋯ → Attach Volume** and set the mount path to `/data`.
   The app automatically finds the volume (via `RAILWAY_VOLUME_MOUNT_PATH`)
   and stores its database there. Without a volume, all accounts and data are
   wiped on every deploy.
3. Generate a public domain under **Settings → Networking** if Railway hasn't
   already.

That's it — no environment variables required.

| Optional env var | Purpose |
| ---------------- | ------- |
| `DB_PATH`        | Override the full path to the SQLite file |
