# 🥋 Hornets Taekwondo - Catanzaro

Web Application full-stack moderna per la palestra **Hornets Taekwondo Catanzaro** — sito vetrina ad alto impatto con backoffice gestionale integrato.

---

## Stack Tecnologico

| Layer | Tecnologia |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (Access + Refresh Token), bcrypt |
| Storage | Multer + filesystem locale (migrazione S3-ready) |
| Deploy | Docker Compose, Nginx reverse proxy |
| CI/CD | GitHub Actions |

---

## Struttura del Repository

```
hornets-taekwondo/
├── frontend/               # Next.js App (porta 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/   # Pagine pubbliche
│   │   │   ├── admin/      # Backoffice protetto
│   │   │   └── api/        # API Routes Next.js
│   │   ├── components/
│   │   │   ├── sections/   # Hero, Corsi, Galleria, Contatti
│   │   │   ├── ui/         # Button, Card, Modal, etc.
│   │   │   └── admin/      # Componenti backoffice
│   │   ├── lib/            # Utility, API client, auth
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types/interfaces
│   └── public/
├── backend/                # Express API (porta 4000)
│   └── src/
│       ├── controllers/    # Business logic
│       ├── middleware/     # Auth, security, upload
│       ├── models/         # Prisma models
│       ├── routes/         # Route definitions
│       ├── services/       # Service layer
│       └── utils/          # Helper functions
├── database/
│   ├── schema.sql          # Schema PostgreSQL completo
│   ├── migrations/         # Migration files
│   └── seeds/              # Dati iniziali
├── deploy/
│   ├── docker-compose.yml
│   └── nginx.conf
└── .github/
    └── workflows/          # CI/CD pipelines
```

---

## Quick Start

### Prerequisiti

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (opzionale)

### Setup con Docker (consigliato)

```bash
# 1. Clona il repository
git clone https://github.com/hornets-taekwondo/webapp.git
cd hornets-taekwondo

# 2. Copia e configura le variabili d'ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Avvia tutti i servizi
docker compose -f deploy/docker-compose.yml up -d

# 4. Esegui le migrazioni
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed

# 5. Apri il browser
# Sito: http://localhost:3000
# Admin: http://localhost:3000/admin
# API:   http://localhost:4000
```

### Setup Manuale

```bash
# === DATABASE ===
psql -U postgres -c "CREATE DATABASE hornets_taekwondo;"
psql -U postgres -d hornets_taekwondo -f database/schema.sql

# === BACKEND ===
cd backend
npm install
cp .env.example .env          # Configura DATABASE_URL, JWT_SECRET, etc.
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev                    # Porta 4000

# === FRONTEND ===
cd ../frontend
npm install
cp .env.example .env.local    # Configura NEXT_PUBLIC_API_URL
npm run dev                    # Porta 3000
```

---

## Variabili d'Ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hornets_taekwondo
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ADMIN_EMAIL=admin@hornets-taekwondo.it
ADMIN_PASSWORD=ChangeMe!2024
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## Sicurezza

- **SQL Injection**: Prisma ORM con query parametrizzate
- **XSS**: Content Security Policy headers + DOMPurify
- **CSRF**: Token double-submit cookie pattern
- **Auth**: JWT con rotation dei refresh token
- **Password**: bcrypt (cost factor 12)
- **Rate Limiting**: 100 req/15min globale, 5 req/15min su /auth
- **Headers**: HSTS, X-Frame-Options, X-Content-Type-Options via Helmet.js

---

## API Endpoints

### Pubblici

| Method | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/corsi` | Lista corsi attivi |
| GET | `/api/galleria` | Foto/video galleria |
| GET | `/api/news` | Ultime notizie |
| POST | `/api/contatti` | Invia messaggio |
| POST | `/api/prenota` | Richiesta prova gratuita |

### Admin (JWT richiesto)

| Method | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login admin |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| CRUD | `/api/admin/corsi` | Gestione corsi |
| CRUD | `/api/admin/galleria` | Gestione media |
| CRUD | `/api/admin/news` | Gestione news |
| CRUD | `/api/admin/iscritti` | Gestione iscritti |
| GET | `/api/admin/contatti` | Messaggi ricevuti |

---

## License

Proprietà di **Hornets Taekwondo ASD - Catanzaro**. Tutti i diritti riservati.
