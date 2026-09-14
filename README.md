# Hamba

Web-first trip planner for Southern Africa. **Stays first**, then flights and activities, with a live ZAR budget.

## What you need on your machine

| Tool | Why |
|------|-----|
| **Node.js 20+** (you have 26) | Run the Next.js app |
| **npm** | Install packages |
| **Git** | Already initialized |
| **A Postgres database** | Neon, Supabase, or Docker — not required until we persist trips |
| **A code editor** | Cursor |

Optional later: Stripe + PayFast sandbox accounts, a stays API key, Mapbox token.

## Run locally

```bash
cd ~/hamba
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## File structure

```
hamba/
├── prisma/
│   └── schema.prisma          # Users, trips, stays/items, budget, bookings
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── page.tsx          # Marketing / landing
│   │   ├── (app)/            # Signed-in product (route group, no URL prefix)
│   │   │   ├── trips/        # Trip list, create, dashboard
│   │   │   └── trips/[tripId]/
│   │   │       ├── stays/    # Stay search + book (hero flow)
│   │   │       ├── itinerary/
│   │   │       ├── budget/
│   │   │       └── documents/
│   │   └── api/
│   │       ├── trips/       # Trip CRUD
│   │       ├── stays/search/ # Stay search (Phase 2)
│   │       └── webhooks/payments/
│   ├── components/           # UI by domain: trip, stay, budget, ui
│   ├── lib/                  # Shared: db, auth, money, stays client
│   ├── server/               # Server-only business logic (reuse for mobile later)
│   └── types/                # Shared TypeScript types
├── .env.example               # Required env vars (copy to .env.local)
└── package.json
```

**Rule:** booking and budget logic live in `src/server` + `src/lib`, not only in React pages, so a 2027 mobile app can call the same APIs.
