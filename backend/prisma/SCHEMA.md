# Database Schema Documentation

## Overview

This document describes the database schema for the Tiến Lên Miền Nam web game platform. The schema is managed using Prisma ORM and PostgreSQL.

## Tables

### Users Table (`users`)

Stores user account information.

**Fields:**
- `id` (SERIAL, PRIMARY KEY): Unique user identifier
- `username` (TEXT, UNIQUE): User's username
- `email` (TEXT, UNIQUE): User's email address
- `password_hash` (TEXT): Hashed password
- `created_at` (TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `username`
- Unique index on `email`
- Index on `created_at` (for sorting/filtering by creation date)

**Relations:**
- One-to-many with `bots`
- One-to-many with `game_players`

---

### Bots Table (`bots`)

Stores AI bot definitions created by users.

**Fields:**
- `id` (SERIAL, PRIMARY KEY): Unique bot identifier
- `user_id` (INTEGER, FOREIGN KEY): Owner user ID
- `name` (TEXT): Bot name
- `code` (TEXT): Bot JavaScript code
- `description` (TEXT, NULLABLE): Bot description
- `created_at` (TIMESTAMP): Bot creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes:**
- Primary key on `id`
- Index on `user_id` (for querying user's bots)
- Index on `created_at` (for sorting by creation date)

**Relations:**
- Many-to-one with `users` (CASCADE delete)

---

### Table Sessions Table (`table_sessions`)

Stores game table session information.

**Fields:**
- `id` (SERIAL, PRIMARY KEY): Unique session identifier
- `config` (JSONB): Session configuration (player count, game count, etc.)
- `status` (TEXT): Session status (Waiting, Ready, In Progress, Completed)
- `started_at` (TIMESTAMP, NULLABLE): Session start time
- `ended_at` (TIMESTAMP, NULLABLE): Session end time
- `created_at` (TIMESTAMP): Session creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes:**
- Primary key on `id`
- Index on `status` (for filtering by status)
- Index on `created_at` (for sorting by creation date)

**Relations:**
- One-to-many with `games`

---

### Games Table (`games`)

Stores individual game records within a session.

**Fields:**
- `id` (SERIAL, PRIMARY KEY): Unique game identifier
- `session_id` (INTEGER, NULLABLE, FOREIGN KEY): Parent session ID
- `table_id` (TEXT, UNIQUE): Table identifier for WebSocket connections
- `winner_id` (INTEGER, NULLABLE): Winner user ID
- `scores` (JSONB, NULLABLE): Final scores per player
- `total_rounds` (INTEGER, DEFAULT 0): Total number of rounds played
- `game_log` (JSONB, NULLABLE): Play-by-play game log
- `started_at` (TIMESTAMP): Game start timestamp
- `ended_at` (TIMESTAMP, NULLABLE): Game end timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `table_id`
- Index on `session_id` (for querying games by session)
- Index on `winner_id` (for querying games by winner)
- Index on `started_at` (for sorting by start time)

**Relations:**
- Many-to-one with `table_sessions` (SET NULL on delete)
- One-to-many with `game_players`

---

### Game Players Table (`game_players`)

Junction table linking games to players with their positions and scores.

**Fields:**
- `id` (SERIAL, PRIMARY KEY): Unique record identifier
- `game_id` (INTEGER, FOREIGN KEY): Game ID
- `user_id` (INTEGER, FOREIGN KEY): Player user ID
- `position` (INTEGER): Player position (0-3)
- `final_score` (INTEGER, NULLABLE): Final score for this player

**Indexes:**
- Primary key on `id`
- Unique composite index on `(game_id, user_id)` (prevents duplicate entries)
- Index on `game_id` (for querying players by game)
- Index on `user_id` (for querying games by player)

**Relations:**
- Many-to-one with `games` (CASCADE delete)
- Many-to-one with `users` (CASCADE delete)

---

## Migrations

### Initial Schema (`20251105164615_initial_schema`)

Creates the initial database schema with all tables, constraints, and foreign keys.

**Tables Created:**
- `users`
- `bots`
- `table_sessions`
- `games`
- `game_players`

**Constraints:**
- Primary keys on all tables
- Unique constraints on `users.username`, `users.email`, `games.table_id`
- Foreign key relationships with appropriate cascade behaviors

### Performance Indexes (`20251108153142_add_performance_indexes`)

Adds performance indexes to improve query performance.

**Indexes Added:**
- `users.created_at` - For sorting/filtering users by creation date
- `bots.user_id` - For querying user's bots
- `bots.created_at` - For sorting bots by creation date
- `table_sessions.status` - For filtering sessions by status
- `table_sessions.created_at` - For sorting sessions by creation date
- `games.session_id` - For querying games by session
- `games.winner_id` - For querying games by winner
- `games.started_at` - For sorting games by start time
- `game_players.game_id` - For querying players by game
- `game_players.user_id` - For querying games by player

---

## Migration Commands

### Apply Migrations
```bash
cd backend
npx prisma migrate deploy
```

### Create New Migration
```bash
cd backend
npx prisma migrate dev --name migration_name
```

### Check Migration Status
```bash
cd backend
npx prisma migrate status
```

### Reset Database (Development Only)
```bash
cd backend
npx prisma migrate reset
```

---

## Schema Evolution

When modifying the schema:

1. Update `prisma/schema.prisma`
2. Create a new migration: `npx prisma migrate dev --name descriptive_name`
3. Test the migration on a development database
4. Update this documentation
5. Apply to production: `npx prisma migrate deploy`

---

## Notes

- All timestamps use `TIMESTAMP(3)` for millisecond precision
- Foreign keys use appropriate cascade behaviors:
  - `bots` and `game_players` cascade delete when parent is deleted
  - `games.session_id` sets to NULL when session is deleted
- JSONB fields (`config`, `scores`, `game_log`) allow flexible schema for game data
- Indexes are optimized for common query patterns (filtering, sorting, joining)

