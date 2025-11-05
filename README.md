# Tiến Lên Miền Nam - Web Game Platform

A web-based multiplayer card game platform for Tiến lên miền Nam (Vietnamese Poker/Thirteen) that bridges traditional gameplay with competitive programming.

## Project Structure

```
tlmn/
├── frontend/          # React + Vite frontend
├── backend/           # NestJS backend
├── shared/            # Shared types and utilities
├── docs/              # Project documentation
└── docker-compose.dev.yml  # Docker Compose for local PostgreSQL
```

## Tech Stack

### Frontend
- React 18+ with Vite
- @tanstack/react-router
- @reduxjs/toolkit
- @tanstack/react-query
- Tailwind CSS
- Framer Motion
- ShadcnUI
- Monaco Editor
- Socket.io-client

### Backend
- NestJS with TypeScript
- Socket.io
- Prisma ORM
- PostgreSQL
- Zod validation
- JWT authentication

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for local development database) OR PostgreSQL 15+

### Installation

```bash
# Install dependencies for all workspaces
pnpm install

# Start PostgreSQL database (using Docker Compose)
docker-compose -f docker-compose.dev.yml up -d

# Setup database (update .env in backend/)
cp backend/env.example backend/.env
cd backend
pnpm db:generate
pnpm db:migrate
```

**Note**: The `docker-compose.dev.yml` file provides a PostgreSQL database for local development. You can also use a local PostgreSQL installation or a cloud database (Neon/Supabase) instead.

### Development

```bash
# Run both frontend and backend
pnpm dev

# Run frontend only
pnpm dev:frontend

# Run backend only
pnpm dev:backend
```

### Building

```bash
# Build all packages
pnpm build

# Build frontend
pnpm build:frontend

# Build backend
pnpm build:backend
```

## Documentation

See `docs/` folder for:
- `core_concept.md` - Game rules and platform features
- `project_planning.md` - Implementation planning and tasks

## License

This project is licensed under the MIT Non-Commercial License. See [LICENSE](LICENSE) for details.

**Commercial use is prohibited** without explicit written permission from the copyright holder.

