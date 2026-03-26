# albumora

A beautiful web app to explore a musical album — artwork, tracklist, lyrics, Wikipedia info, and more, all in one immersive view.

## Tech stack

- **Frontend** — React, TypeScript, Vite, Tailwind CSS, React Query
- **Backend** — Node.js, Express, TypeScript
- **Data sources** — iTunes Search API, MusicBrainz, Wikipedia, lyrics.ovh

## Prerequisites

- Node.js 18+
- npm

## Local development

Install dependencies for both server and client:

```bash
npm run install:all
```

Start both the server and client in one command:

```bash
npm run dev
```

- Client: http://localhost:7070
- Server: http://localhost:3000

The client proxies all `/api` requests to the server automatically.

## Build for production

Build the client (outputs to `client/dist`):

```bash
npm run build
```

Run the compiled server:

```bash
cd server && npm run build && npm start
```

## Project structure

```
albumora/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── lib/
└── server/          # Express backend
    └── src/
        ├── routes/
        ├── services/    # iTunes, MusicBrainz, Wikipedia, lyrics, colour
        └── aggregator/
```
