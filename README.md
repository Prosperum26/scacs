# SCACS — Smart Campus Access Control System

Full-stack QR-based campus access control for universities. Students carry a **rotating secure QR pass**; security staff scan it at gates with a live webcam. All events are logged with real-time updates.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Socket.IO client, html5-qrcode, Recharts |
| Backend | Node.js, Express 5, TypeScript, Socket.IO |
| Database | **MongoDB** (Mongoose) |
| Auth | JWT (login) + short-lived signed QR tokens (60s, one-time use) |

The student portal is **mobile-first**: bottom tab navigation, responsive QR size, safe-area insets for notched phones, and touch-friendly controls (44px+ targets).

## Quick start

### 1. MongoDB

Use any of:

- **Local:** [MongoDB Community](https://www.mongodb.com/try/download/community) on `mongodb://127.0.0.1:27017/scacs`
- **Atlas:** Create a free cluster and set `MONGODB_URI` in `backend/.env`
- **Atlas Local (Docker):** `docker run -d -p 27017:27017 mongodb/mongodb-community-server:latest`

Copy env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Install & seed

```bash
cd backend
npm install
npm run seed

cd ../frontend
npm install
```

### 3. Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open **http://localhost:5173**

### Demo accounts (after `npm run seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@scacs.edu` | `Password123!` |
| Student | `sv2026001@student.scacs.edu` | `Password123!` |

## Portals

- **/** — Portal home
- **/student/** — Register, login, dashboard, rotating QR, access history
- **/admin/** — Security login, live QR scanner, logs, students, analytics, alerts

## QR security

- QR payload is a **signed JWT** (not plain student data)
- Expires in **60 seconds** (configurable via `QR_TOKEN_EXPIRY_SEC`)
- **One-time use** per session (screenshot/reuse → DENIED + alert)
- Auto-refresh on student device every ~45s

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login/student` | Student login |
| POST | `/api/auth/login/admin` | Admin login |
| GET | `/api/qr/token` | Generate QR (student, auth) |
| POST | `/api/access/verify` | Verify scanned QR (admin, auth) |
| GET | `/api/access/history` | Student access history |
| GET | `/api/admin/analytics` | Dashboard charts data |
| GET | `/api/admin/students` | Student management |

Real-time: Socket.IO events `scan:result`, `logs:updated`, `alerts:new`

## Production deploy (Render + Vercel + Atlas)

Chi tiết từng bước (tạo DB, biến môi trường, seed, CORS, xử lý lỗi):

**[DEPLOY.md](./DEPLOY.md)**

## MongoDB plugin (Cursor)

Configure the MongoDB MCP server in Cursor Settings with `MDB_MCP_CONNECTION_STRING` (same URI as `MONGODB_URI`) to let the agent inspect collections and help with queries.

## Project structure

```
scacs/
├── backend/src/
│   ├── models/       # User, QrSession, AccessLog, Alert, Gate
│   ├── services/     # auth, qr, access, analytics
│   ├── routes/       # REST API
│   └── scripts/seed.ts
└── frontend/src/
    ├── pages/student/
    ├── pages/admin/
    └── context/      # Auth + Socket
```

## License

MIT — see [LICENSE](./LICENSE)
