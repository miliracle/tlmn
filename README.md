# Tiến Lên Miền Nam - Web Game Platform

A web-based multiplayer card game platform for Tiến lên miền Nam (Vietnamese Poker/Thirteen) that bridges traditional gameplay with competitive programming.

## Project Structure

```
tlmn/
├── frontend/          # React + Vite frontend
├── backend/           # NestJS backend
├── shared/            # Shared types and utilities
└── docs/              # Project documentation
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
- PostgreSQL 15+

### Installation

```bash
# Install dependencies for all workspaces
pnpm install

# Setup database (update .env in backend/)
cd backend
pnpm db:generate
pnpm db:migrate
```

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

Private project

