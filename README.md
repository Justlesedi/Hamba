# Hamba

MVP trip planner. Built for a small number of users on a local SQLite file. We will move to Postgres when we scale.

## Run locally

```bash
cd ~/hamba
cp .env.example frontend/.env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `SESSION_SECRET` in `frontend/.env.local` (`openssl rand -base64 32`).

## File structure

```
hamba/
├── frontend/     # UI
├── backend/      # Server logic and SQLite database
└── api/          # HTTP endpoints
```
