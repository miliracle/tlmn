# Setup Instructions

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for local development database) OR PostgreSQL 15+ (or use Neon/Supabase)

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

#### Option A: Docker Compose (Recommended for Development)

1. Start PostgreSQL using Docker Compose:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Copy the environment example file:
```bash
cp backend/env.example backend/.env
```

3. The database connection is already configured in `backend/env.example`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/tienlen?schema=public"
```

To stop the database:
```bash
docker-compose -f docker-compose.dev.yml down
```

To remove the database and all data:
```bash
docker-compose -f docker-compose.dev.yml down -v
```

#### Option B: Local PostgreSQL

1. Create a PostgreSQL database:
```bash
createdb tienlen
```

2. Copy the environment example file:
```bash
cp backend/env.example backend/.env
```

3. Update `backend/.env` with your database connection:
```
DATABASE_URL="postgresql://user:password@localhost:5432/tienlen?schema=public"
```

#### Option C: Neon/Supabase (Cloud)

1. Create a new database on Neon or Supabase
2. Copy the connection string to `backend/.env`

### 3. Generate Prisma Client

```bash
cd backend
pnpm db:generate
```

### 4. Run Database Migrations

```bash
pnpm db:migrate
```

This will create all the necessary tables in your database.

### 5. Start Development Servers

#### Start both frontend and backend:
```bash
pnpm dev
```

#### Or start them separately:

Frontend only (port 3000):
```bash
pnpm dev:frontend
```

Backend only (port 3001):
```bash
pnpm dev:backend
```

## Project Structure

```
tlmn/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API and socket services
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── features/     # Feature modules
│   └── package.json
│
├── backend/           # NestJS backend
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/     # Authentication
│   │   │   ├── bots/     # Bot management
│   │   │   ├── games/    # Game management
│   │   │   ├── tables/   # Table management
│   │   │   ├── users/    # User management
│   │   │   └── websocket/# WebSocket gateway
│   │   ├── decorators/   # Custom decorators
│   │   ├── guards/       # Auth guards
│   │   ├── interceptors/ # Interceptors
│   │   └── utils/        # Utility functions
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
├── shared/            # Shared types and utilities
│   ├── src/
│   │   ├── types/        # Shared TypeScript types
│   │   └── utils/        # Shared utility functions
│   └── package.json
│
└── docs/              # Project documentation
```

## Available Scripts

### Root Level (pnpm from root)

- `pnpm dev` - Start both frontend and backend
- `pnpm dev:frontend` - Start frontend only
- `pnpm dev:backend` - Start backend only
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm db:migrate` - Run database migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio

### Frontend (cd frontend)

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Backend (cd backend)

- `pnpm start:dev` - Start dev server with hot reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm test` - Run tests
- `pnpm db:migrate` - Run database migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tienlen?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

## Next Steps

1. **Set up your database** and run migrations
2. **Install dependencies** with `pnpm install`
3. **Start development servers** with `pnpm dev`
4. **Begin implementing features** according to `docs/project_planning.md`

## Troubleshooting

### Database Connection Issues

- **If using Docker Compose**: Make sure the container is running with `docker-compose -f docker-compose.dev.yml ps`
- **If using local PostgreSQL**: Make sure PostgreSQL is running
- Check your `DATABASE_URL` in `backend/.env`
- Verify database exists: `psql -l | grep tienlen` (for local PostgreSQL) or check Docker logs: `docker-compose -f docker-compose.dev.yml logs postgres`

### Port Already in Use

- Frontend default: 3000
- Backend default: 3001
- Change ports in `frontend/vite.config.ts` and `backend/.env` if needed

### Prisma Issues

- Run `pnpm db:generate` after schema changes
- Run `pnpm db:migrate` to apply migrations
- Use `pnpm db:studio` to inspect database

### Module Resolution Issues

- Make sure you ran `pnpm install` from the root
- Check that `pnpm-workspace.yaml` is correct
- Try deleting `node_modules` and reinstalling

