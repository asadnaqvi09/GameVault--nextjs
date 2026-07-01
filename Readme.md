# GameVault

Premium PC game storefront — Next.js frontend, Express API, and MongoDB.

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Redux Toolkit |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Email | Nodemailer (SMTP) |
| Media | Cloudinary (payment proof uploads) |
| Fonts | Satoshi (headings), Work Sans (body) |

## Project structure

```
Game_Selling_Website/
├── frontend/          # Next.js app → deploy to Vercel
└── backend/           # Express API → deploy to Render
```

## Features

- Landing page with hero, genre filters, and trending games
- Searchable game catalog with detailed product pages
- User authentication (register, login, password recovery)
- Cart, checkout, and manual payment proof upload
- Admin panel (games, orders, reviews, contacts)
- Blog section (static JSON content)
- On-sale deals and favorites

## Local development

### Backend

```bash
cd backend
npm install
# Create backend/.env with the variables listed below
npm run dev          # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
# Create frontend/.env.local with the variables listed below
npm run dev          # http://localhost:3000
```

### Seed database (optional)

```bash
cd backend
npm run seed
npm run seed:reviews
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` locally, `production` on Render |
| `PORT` | Defaults to `5000` (Render sets this automatically) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `CLIENT_URL` | Frontend URL — `http://localhost:3000` locally, Vercel URL in production |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `SMTP_HOST` | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port — usually `587` (TLS) or `465` (SSL) |
| `SMTP_SECURE` | Set to `true` for port 465, otherwise `false` |
| `SMTP_USER` | SMTP username / email |
| `SMTP_PASS` | SMTP password or app password |
| `MAIL_FROM` | Sender address, e.g. `GameVault <noreply@yourdomain.com>` |
| `ADMIN_EMAIL` | Admin inbox for contact form notifications |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Render server origin — `http://localhost:5000` locally, `https://<your-render-service>.onrender.com` in production (`/api/v1` is appended automatically) |
| `NEXT_PUBLIC_JAZZCASH_NUMBER` | JazzCash number shown at checkout (optional) |
| `NEXT_PUBLIC_EASYPAISA_NUMBER` | EasyPaisa number shown at checkout (optional) |

## API

- Base path: `/api/v1`
- Health check: `GET /api/v1/health`
- Auth uses a short-lived JWT access token plus an httpOnly refresh cookie (`SameSite=None; Secure`) for cross-origin Vercel ↔ Render sessions

## Production deployment

| Service | Platform | Root directory | Build | Start |
|---------|----------|----------------|-------|-------|
| Frontend | [Vercel](https://vercel.com) | `frontend` | `npm run build` | (managed by Vercel) |
| API | [Render](https://render.com) | `backend` | `npm install` | `npm start` |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) | — | — | — |

### Deploy order

1. **MongoDB Atlas** — create a cluster, allow network access (`0.0.0.0/0` for Render), copy `MONGO_URI`
2. **Render (backend)** — deploy `backend/`, set env vars, confirm `GET /api/v1/health` returns 200
3. **Vercel (frontend)** — deploy `frontend/` with `NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com`
4. **Update Render** — set `CLIENT_URL` to your final Vercel URL and redeploy if CORS blocks requests
5. **Seed production** (optional) — run `npm run seed` locally against the production `MONGO_URI`

### Render settings

- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Health check path:** `/api/v1/health`

### Vercel settings

- **Root directory:** `frontend`
- **Framework preset:** Next.js
- Set `NEXT_PUBLIC_*` variables **before** the first build — they are embedded at build time

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | frontend / backend | Development server |
| `npm run build` | frontend | Production build |
| `npm start` | backend | Production API server |
| `npm run seed` | backend | Seed games from JSON |
| `npm run seed:reviews` | backend | Seed sample reviews |
| `npm run lint` | frontend | ESLint |

## License

ISC
