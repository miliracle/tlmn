# Tiến Lên Miền Nam - Project Planning Document

## Overview

This document breaks down the Tiến Lên Miền Nam web game platform into Epics, User Stories, Tasks, and Subtasks for implementation planning.

**Structure:**
- **Epic:** Large feature areas or major components
- **Story:** User-facing features or functional requirements
- **Task:** Implementation work items
- [ ] **Subtask:** Detailed steps within a task

---

## Epic 1: Project Foundation & Infrastructure

### Story 1.1: Project Setup & Development Environment

#### Task 1.1.1: Frontend Project Initialization
- [x] **Subtask 1.1.1.1:** Initialize React project with Vite
- [x] **Subtask 1.1.1.2:** Install and configure Tailwind CSS
- [x] **Subtask 1.1.1.3:** Set up @tanstack/react-router
- [x] **Subtask 1.1.1.4:** Configure ESLint and Prettier
- [x] **Subtask 1.1.1.5:** Set up folder structure (components, pages, hooks, utils, services, store, features)
- [x] **Subtask 1.1.1.6:** Install core dependencies (React, @reduxjs/toolkit, @tanstack/react-query, @tanstack/react-router, socket.io-client, Framer Motion, ShadcnUI)
- [x] **Subtask 1.1.1.7:** Configure Redux Toolkit store (slices for UI state)
- [x] **Subtask 1.1.1.8:** Configure React Query (query client, providers)
- [x] **Subtask 1.1.1.9:** Set up ShadcnUI components

#### Task 1.1.2: Backend Project Initialization
- [x] **Subtask 1.1.2.1:** Initialize Nest.js project with TypeScript
- [x] **Subtask 1.1.2.2:** Configure TypeScript and Nest.js CLI
- [x] **Subtask 1.1.2.3:** Configure environment variables (.env)
- [x] **Subtask 1.1.2.4:** Set up Nest.js folder structure (modules, controllers, services, guards, decorators)
- [x] **Subtask 1.1.2.5:** Install core dependencies (@nestjs/core, @nestjs/common, @nestjs/platform-socket.io, @nestjs/jwt, Socket.io, Prisma, Zod)

#### Task 1.1.3: Database Setup
- [x] **Subtask 1.1.3.1:** Set up PostgreSQL database (local, Neon, or Supabase)
- [x] **Subtask 1.1.3.2:** Configure Prisma ORM for PostgreSQL
- [x] **Subtask 1.1.3.3:** Create initial Prisma schema (Users, Bots, Games, TableSessions, GamePlayers models)
- [x] **Subtask 1.1.3.4:** Set up Prisma migrations for PostgreSQL
- [x] **Subtask 1.1.3.5:** Create seed scripts for testing

#### Task 1.1.4: Development Tools Setup
- [x] **Subtask 1.1.4.1:** Configure Git repository and .gitignore
- [x] **Subtask 1.1.4.2:** Set up package.json scripts (dev, build, test)
- [x] **Subtask 1.1.4.3:** Configure VS Code workspace settings
- [x] **Subtask 1.1.4.4:** Set up hot-reload for development

---

## Epic 2: Core Game Engine & Rules Implementation

### Story 2.1: Card System & Deck Management

#### Task 2.1.1: Card Data Model
- [x] **Subtask 2.1.1.1:** Define card interface/type (rank, suit, value, points, id)
- [x] **Subtask 2.1.1.2:** Create card ranking constants (2 > A > K > ... > 3)
- [x] **Subtask 2.1.1.3:** Create suit ranking constants (Hearts > Diamonds > Clubs > Spades)
- [x] **Subtask 2.1.1.4:** Implement card value calculation function
- [x] **Subtask 2.1.1.5:** Implement card point calculation (heo values: 1-2, hàng: 4)

#### Task 2.1.2: Deck Initialization & Shuffling
- [x] **Subtask 2.1.2.1:** Create function to generate 52-card deck
- [x] **Subtask 2.1.2.2:** Implement Fisher-Yates shuffle algorithm
- [x] **Subtask 2.1.2.3:** Create deck validation tests

#### Task 2.1.3: Card Distribution
- [x] **Subtask 2.1.3.1:** Implement dealCards function (13 cards per player)
- [x] **Subtask 2.1.3.2:** Handle unused cards for 2-3 player games
- [x] **Subtask 2.1.3.3:** Validate card distribution (all players get 13 cards)

### Story 2.2: Combination Detection & Validation

#### Task 2.2.1: Basic Combination Detection
- [x] **Subtask 2.2.1.1:** Implement single card detection
- [x] **Subtask 2.2.1.2:** Implement pair detection (đôi)
- [x] **Subtask 2.2.1.3:** Implement triple detection (ba/sám cô)
- [x] **Subtask 2.2.1.4:** Create combination type enum/constants

#### Task 2.2.2: Straight Detection (Sảnh)
- [x] **Subtask 2.2.2.1:** Implement straight validation (3-12 cards, consecutive ranks)
- [x] **Subtask 2.2.2.2:** Validate straight cannot include rank 2
- [x] **Subtask 2.2.2.3:** Implement straight comparison (length > rank)
- [x] **Subtask 2.2.2.4:** Handle same-length straight comparison (highest card + suit)

#### Task 2.2.3: Consecutive Pairs Detection (Đôi Thông)
- [x] **Subtask 2.2.3.1:** Implement consecutive pairs detection (3-6 pairs)
- [x] **Subtask 2.2.3.2:** Validate pairs are consecutive ranks (cannot include 2)
- [x] **Subtask 2.2.3.3:** Implement comparison logic (length > rank)
- [x] **Subtask 2.2.3.4:** Handle same-length comparison (highest pair rank + suit)

#### Task 2.2.4: Four of a Kind Detection (Tứ Quý)
- [x] **Subtask 2.2.4.1:** Implement four of a kind detection
- [x] **Subtask 2.2.4.2:** Validate tứ quý cannot be formed with rank 2 (heo)
- [x] **Subtask 2.2.4.3:** Implement tứ quý comparison (by rank only)

#### Task 2.2.5: Combination Comparison System
- [x] **Subtask 2.2.5.1:** Create function to compare two combinations
- [x] **Subtask 2.2.5.2:** Implement type-based comparison (same type required)
- [x] **Subtask 2.2.5.3:** Handle tie-breaking (suit comparison for same rank)
- [x] **Subtask 2.2.5.4:** Create comprehensive test cases

### Story 2.3: Instant Win Conditions (Tới Trắng)

#### Task 2.3.1: Initial Round Instant Win Detection
- [x] **Subtask 2.3.1.1:** Check for tứ quý 3 (four 3s)
- [x] **Subtask 2.3.1.2:** Check for tứ quý heo (all four 2s)
- [x] **Subtask 2.3.1.3:** Check for 3 đôi thông có ♠3
- [x] **Subtask 2.3.1.4:** Check for 4 đôi thông có ♠3
- [x] **Subtask 2.3.1.5:** Check for 3 sám cô
- [x] **Subtask 2.3.1.6:** Check for 4 sám cô
- [x] **Subtask 2.3.1.7:** Check for 3 tứ quý
- [x] **Subtask 2.3.1.8:** Check for 5 đôi 1 sám
- [x] **Subtask 2.3.1.9:** Check for 5 đôi thông 1 sám

#### Task 2.3.2: Other Round Instant Win Detection
- [x] **Subtask 2.3.2.1:** Check for tứ quý heo
- [x] **Subtask 2.3.2.2:** Check for 5 đôi thông
- [x] **Subtask 2.3.2.3:** Check for 6 đôi bất kì
- [x] **Subtask 2.3.2.4:** Check for sảnh rồng (3 to A straight)
- [x] **Subtask 2.3.2.5:** Check for đồng chất đồng màu (all same color)

#### Task 2.3.3: Instant Win Handler
- [x] **Subtask 2.3.3.1:** Create checkInstantWin function
- [x] **Subtask 2.3.3.2:** Determine which round type (initial vs other)
- [x] **Subtask 2.3.3.3:** Return instant win result and type
- [x] **Subtask 2.3.3.4:** Handle instant win game end flow

### Story 2.4: Move Validation & Turn Management

#### Task 2.4.1: Move Validation System
- [x] **Subtask 2.4.1.1:** Create isValidMove function
- [x] **Subtask 2.4.1.2:** Validate combination type matches last play
- [x] **Subtask 2.4.1.3:** Validate combination beats last play (higher value)
- [x] **Subtask 2.4.1.4:** Handle first player in round (no restrictions except ♠3 rule)
- [x] **Subtask 2.4.1.5:** Validate player has selected cards in hand
- [x] **Subtask 2.4.1.6:** Return detailed validation errors

#### Task 2.4.2: Turn Order Management
- [x] **Subtask 2.4.2.1:** Implement counter-clockwise turn order
- [x] **Subtask 2.4.2.2:** Track current turn player index
- [x] **Subtask 2.4.2.3:** Handle turn advancement
- [x] **Subtask 2.4.2.4:** Implement turn timeout (30 seconds)

#### Task 2.4.3: Passing System
- [x] **Subtask 2.4.3.1:** Implement passTurn function
- [x] **Subtask 2.4.3.2:** Track passed players per round
- [x] **Subtask 2.4.3.3:** Enforce pass rule (cannot play again in same round)
- [x] **Subtask 2.4.3.4:** Reset passed status for new round

#### Task 2.4.4: First Round Special Rules (Ván Khởi Đầu)
- [x] **Subtask 2.4.4.1:** Find player with ♠3
- [x] **Subtask 2.4.4.2:** Validate first play includes ♠3
- [x] **Subtask 2.4.4.3:** Handle player cannot form combination with ♠3 (play as single)
- [x] **Subtask 2.4.4.4:** Set initial round flag

### Story 2.5: Cutting Rules (Chặt) Implementation

#### Task 2.5.1: Vòng Detection
- [x] **Subtask 2.5.1.1:** Track if any player has played in current round
- [x] **Subtask 2.5.1.2:** Create hasVong function
- [x] **Subtask 2.5.1.3:** Handle first player exception (no vòng)

#### Task 2.5.2: Single Heo Tracking
- [x] **Subtask 2.5.2.1:** Track consecutive single heo plays
- [x] **Subtask 2.5.2.2:** Distinguish between single heo vs đôi heo
- [x] **Subtask 2.5.2.3:** Reset tracking on new round or non-heo play
- [x] **Subtask 2.5.2.4:** Count how many single heo in sequence

#### Task 2.5.3: Cutting Rule Validation
- [x] **Subtask 2.5.3.1:** Implement 3 đôi thông cutting rules
- [x] **Subtask 2.5.3.2:** Implement tứ quý cutting rules
- [x] **Subtask 2.5.3.3:** Implement 4 đôi thông cutting rules (no vòng requirement)
- [x] **Subtask 2.5.3.4:** Validate 3 con heo cannot be cut
- [x] **Subtask 2.5.3.5:** Create canCut function

#### Task 2.5.4: Chặt Chồng (Stacked Cutting)
- [x] **Subtask 2.5.4.1:** Track cutting chain
- [x] **Subtask 2.5.4.2:** Implement penalty transfer logic
- [x] **Subtask 2.5.4.3:** Calculate cumulative penalties for last person cut
- [x] **Subtask 2.5.4.4:** Handle chặt and finish rule (no penalty if winner finishes)

### Story 2.6: Round Management

#### Task 2.6.1: Round State Tracking
- [x] **Subtask 2.6.1.1:** Track current round number
- [x] **Subtask 2.6.1.2:** Track last play in round
- [x] **Subtask 2.6.1.3:** Track passed players array
- [x] **Subtask 2.6.1.4:** Track round winner

#### Task 2.6.2: Round End Detection
- [x] **Subtask 2.6.2.1:** Detect 3 consecutive passes
- [x] **Subtask 2.6.2.2:** Detect all remaining players passed
- [x] **Subtask 2.6.2.3:** Handle Hưởng Sái rule (player to winner's right starts next round)
- [x] **Subtask 2.6.2.4:** Check for game end (winner has no cards)

#### Task 2.6.3: Round Transition
- [x] **Subtask 2.6.3.1:** Determine next round leader
- [x] **Subtask 2.6.3.2:** Reset round state (passed players, last play)
- [x] **Subtask 2.6.3.3:** Increment round counter
- [x] **Subtask 2.6.3.4:** Clear played cards history

### Story 2.7: Game End & Winner Determination

#### Task 2.7.1: Game End Detection
- [x] **Subtask 2.7.1.1:** Check if player has 0 cards after play
- [x] **Subtask 2.7.1.2:** Handle instant win game end
- [x] **Subtask 2.7.1.3:** Stop game immediately when winner detected

#### Task 2.7.2: Player Ranking (Losers)
- [x] **Subtask 2.7.2.1:** Count cards remaining for each loser
- [x] **Subtask 2.7.2.2:** Rank players by card count (fewest = 2nd place)
- [x] **Subtask 2.7.2.3:** Handle tie-breaking (compare total card values)
- [x] **Subtask 2.7.2.4:** Determine về bét (last place)

#### Task 2.7.3: Cóng Detection
- [x] **Subtask 2.7.3.1:** Track if player played any cards during game
- [x] **Subtask 2.7.3.2:** Detect cóng 1 nhà, cóng 2 nhà, cóng 3 nhà
- [x] **Subtask 2.7.3.3:** Implement đền bài detection (playable cards not played) - Placeholder implementation (requires full game state tracking)
- [x] **Subtask 2.7.3.4:** Handle đền bài penalty calculation

### Story 2.8: Scoring & Penalty System

#### Task 2.8.1: Chặt Penalty Calculation
- [x] **Subtask 2.8.1.1:** Calculate penalty for cutting 1 heo (1-2 points)
- [x] **Subtask 2.8.1.2:** Calculate penalty for cutting 2-4 heo (sum of values)
- [x] **Subtask 2.8.1.3:** Calculate penalty for cutting đôi heo (2 × heo value)
- [x] **Subtask 2.8.1.4:** Calculate penalty for cutting hàng (4 points)
- [x] **Subtask 2.8.1.5:** Track penalties per player during game
- [x] **Subtask 2.8.1.6:** Handle penalty transfer (chặt chồng)

#### Task 2.8.2: Thúi Penalty Calculation
- [x] **Subtask 2.8.2.1:** Check if last-place player has heo in hand
- [x] **Subtask 2.8.2.2:** Check if last-place player has hàng in hand
- [x] **Subtask 2.8.2.3:** Calculate thúi penalties (heo values + hàng × 4)
- [x] **Subtask 2.8.2.4:** Determine who receives thúi penalties (3rd place or winner)

#### Task 2.8.3: Cóng Penalty Calculation
- [x] **Subtask 2.8.3.1:** Calculate tới trắng penalty value (13 × player count)
- [x] **Subtask 2.8.3.2:** Apply cóng penalty per stuck player
- [x] **Subtask 2.8.3.3:** Handle đền bài penalty (all cóng penalties)
- [x] **Subtask 2.8.3.4:** Apply cóng penalty to winner's total

#### Task 2.8.4: Game Score Calculation
- [x] **Subtask 2.8.4.1:** Calculate winner's card points (1 per card remaining in losers)
- [x] **Subtask 2.8.4.2:** Calculate winner's total points (cards + cóng + chặt received + thúi)
- [x] **Subtask 2.8.4.3:** Calculate loser points (negative: cards + cóng + chặt paid + thúi)
- [x] **Subtask 2.8.4.4:** Calculate tới trắng scoring
- [x] **Subtask 2.8.4.5:** Return complete score breakdown

#### Task 2.8.5: Session Score Accumulation
- [x] **Subtask 2.8.5.1:** Track points per game for each player
- [x] **Subtask 2.8.5.2:** Accumulate points across all games in session
- [x] **Subtask 2.8.5.3:** Calculate session totals
- [x] **Subtask 2.8.5.4:** Determine final session ranking

---

## Epic 3: Database & Backend Infrastructure

### Story 3.1: Database Schema Design

#### Task 3.1.1: Users Table
- [x] **Subtask 3.1.1.1:** Create users table schema (id, username, email, password_hash, created_at)
- [x] **Subtask 3.1.1.2:** Add unique constraints
- [x] **Subtask 3.1.1.3:** Create indexes for performance
- [x] **Subtask 3.1.1.4:** Set up Prisma models

#### Task 3.1.2: Bots Table
- [x] **Subtask 3.1.2.1:** Create bots table schema (id, user_id, name, code, description, timestamps)
- [x] **Subtask 3.1.2.2:** Set up foreign key relation to users table
- [x] **Subtask 3.1.2.3:** Add indexes
- [x] **Subtask 3.1.2.4:** Set up Prisma models

#### Task 3.1.3: Games & Sessions Tables
- [x] **Subtask 3.1.3.1:** Create table_sessions table (id, config, status, started_at, ended_at)
- [x] **Subtask 3.1.3.2:** Create games table (id, session_id, table_id, winner_id, scores, game_log, total_rounds, timestamps)
- [x] **Subtask 3.1.3.3:** Create game_players junction table (game_id, user_id, position, final_score)
- [x] **Subtask 3.1.3.4:** Set up foreign key relationships in Prisma
- [x] **Subtask 3.1.3.5:** Create indexes for queries

#### Task 3.1.4: Database Migrations
- [x] **Subtask 3.1.4.1:** Create initial migration
- [x] **Subtask 3.1.4.2:** Test migrations (up and down)
- [x] **Subtask 3.1.4.3:** Document schema changes

### Story 3.2: API Endpoints (REST)

#### Task 3.2.1: Authentication Endpoints
- [x] **Subtask 3.2.1.1:** POST /api/auth/register
- [x] **Subtask 3.2.1.2:** POST /api/auth/login
- [x] **Subtask 3.2.1.3:** POST /api/auth/logout
- [x] **Subtask 3.2.1.4:** GET /api/auth/me (get current user)
- [x] **Subtask 3.2.1.5:** Implement JWT token generation and validation

#### Task 3.2.2: Bot Management Endpoints
- [x] **Subtask 3.2.2.1:** GET /api/bots (list user's bots)
- [x] **Subtask 3.2.2.2:** POST /api/bots (create bot)
- [x] **Subtask 3.2.2.3:** GET /api/bots/:id (get bot)
- [x] **Subtask 3.2.2.4:** PUT /api/bots/:id (update bot)
- [x] **Subtask 3.2.2.5:** DELETE /api/bots/:id (delete bot)
- [x] **Subtask 3.2.2.6:** POST /api/bots/:id/test (test bot)

#### Task 3.2.3: Table Management Endpoints
- [x] **Subtask 3.2.3.1:** POST /api/tables (create table)
- [x] **Subtask 3.2.3.2:** GET /api/tables (list all tables with pagination and filtering support)
  - [x] Pagination (page, limit, offset)
  - [x] Filtering (status, playerCount, minPlayers, maxPlayers, search)
  - [x] Sorting (sortBy, sortOrder)
- [x] **Subtask 3.2.3.3:** GET /api/tables/:id (get table info)
- [x] **Subtask 3.2.3.4:** POST /api/tables/:id/join (join table)
- [x] **Subtask 3.2.3.5:** DELETE /api/tables/:id/leave (leave table, will remove the table if no player left)
- [x] **Subtask 3.2.3.6:** DELETE /api/tables/:id (remove table when no one is playing - verifies no active players)
- [x] **Subtask 3.2.3.7:** DELETE /api/tables/:id/force (admin: force remove all players and delete table)

#### Task 3.2.4: Game History Endpoints
- [x] **Subtask 3.2.4.1:** GET /api/games (list user's games)
- [x] **Subtask 3.2.4.2:** GET /api/games/:id (get game details)
- [x] **Subtask 3.2.4.3:** GET /api/sessions/:id (get session summary)

### Story 3.3: Middleware & Validation

#### Task 3.3.1: Authentication Middleware
- [x] **Subtask 3.3.1.1:** Create JWT verification middleware
- [x] **Subtask 3.3.1.2:** Handle token expiration
- [x] **Subtask 3.3.1.3:** Attach user to request object

#### Task 3.3.2: Authorization & Role-Based Access Control
- [x] **Subtask 3.3.2.1:** Add role field to User model (admin, user)
- [x] **Subtask 3.3.2.2:** Create AdminGuard for admin-only endpoints
- [x] **Subtask 3.3.2.3:** Implement role checking logic
- [x] **Subtask 3.3.2.4:** Apply AdminGuard to DELETE /api/tables/:id/force endpoint
- [x] **Subtask 3.3.2.5:** Add role-based access control for other admin endpoints

#### Task 3.3.3: Input Validation
- [x] **Subtask 3.3.3.1:** Create Zod schemas for all endpoints
- [x] **Subtask 3.3.3.2:** Implement validation middleware
- [x] **Subtask 3.3.3.3:** Return detailed validation errors

#### Task 3.3.4: Error Handling
- [x] **Subtask 3.3.4.1:** Create error handler middleware
- [x] **Subtask 3.3.4.2:** Standardize error response format
- [x] **Subtask 3.3.4.3:** Log errors appropriately

---

## Epic 4: Real-Time Multiplayer System (WebSocket)

### Story 4.1: WebSocket Server Setup

#### Task 4.1.1: Socket.io Server Configuration
- [ ] **Subtask 4.1.1.1:** Install and configure Socket.io on Nest.js server
- [ ] **Subtask 4.1.1.2:** Set up CORS configuration
- [ ] **Subtask 4.1.1.3:** Configure connection options
- [ ] **Subtask 4.1.1.4:** Set up authentication for socket connections

#### Task 4.1.2: Room Management
- [ ] **Subtask 4.1.2.1:** Implement table room system
- [ ] **Subtask 4.1.2.2:** Create joinTable function
- [ ] **Subtask 4.1.2.3:** Create leaveTable function
- [ ] **Subtask 4.1.2.4:** Track players in each room

### Story 4.2: WebSocket Events - Table Management

#### Task 4.2.1: Table Creation Events
- [ ] **Subtask 4.2.1.1:** Handle `create_table` event (client → server)
- [ ] **Subtask 4.2.1.2:** Emit `table_created` event (server → client)
- [ ] **Subtask 4.2.1.3:** Broadcast table state to all clients

#### Task 4.2.2: Player Join/Leave Events
- [ ] **Subtask 4.2.2.1:** Handle `join_table` event
- [ ] **Subtask 4.2.2.2:** Emit `player_joined` event (broadcast)
- [ ] **Subtask 4.2.2.3:** Handle `leave_table` event
- [ ] **Subtask 4.2.2.4:** Emit `player_left` event (broadcast)
- [ ] **Subtask 4.2.2.5:** Update table state and notify all players

#### Task 4.2.3: Player Ready Events
- [ ] **Subtask 4.2.3.1:** Handle `player_ready` event
- [ ] **Subtask 4.2.3.2:** Track ready status per player
- [ ] **Subtask 4.2.3.3:** Emit ready status updates
- [ ] **Subtask 4.2.3.4:** Check if all players ready

### Story 4.3: WebSocket Events - Gameplay

#### Task 4.3.1: Game Start Events
- [ ] **Subtask 4.3.1.1:** Handle `start_game` event (host only)
- [ ] **Subtask 4.3.1.2:** Initialize game state
- [ ] **Subtask 4.3.1.3:** Deal cards
- [ ] **Subtask 4.3.1.4:** Emit `game_started` event with game state
- [ ] **Subtask 4.3.1.5:** Send personalized game state to each player

#### Task 4.3.2: Gameplay Events
- [ ] **Subtask 4.3.2.1:** Handle `play_cards` event
- [ ] **Subtask 4.3.2.2:** Validate move server-side
- [ ] **Subtask 4.3.2.3:** Update game state
- [ ] **Subtask 4.3.2.4:** Emit `game_state_update` event (broadcast)
- [ ] **Subtask 4.3.2.5:** Handle `pass_turn` event
- [ ] **Subtask 4.3.2.6:** Check for round/game end after each move

#### Task 4.3.3: Turn Management Events
- [ ] **Subtask 4.3.3.1:** Emit `turn_started` event with current player
- [ ] **Subtask 4.3.3.2:** Start turn timer (30 seconds)
- [ ] **Subtask 4.3.3.3:** Handle `turn_timeout` event (auto-pass)
- [ ] **Subtask 4.3.3.4:** Emit timeout notifications

#### Task 4.3.4: Game End Events
- [ ] **Subtask 4.3.4.1:** Detect game end condition
- [ ] **Subtask 4.3.4.2:** Calculate final scores
- [ ] **Subtask 4.3.4.3:** Emit `game_ended` event with results
- [ ] **Subtask 4.3.4.4:** Save game to database

### Story 4.4: State Synchronization

#### Task 4.4.1: Game State Management
- [ ] **Subtask 4.4.1.1:** Create GameState class/object
- [ ] **Subtask 4.4.1.2:** Implement getGameStateForPlayer (hide opponent hands)
- [ ] **Subtask 4.4.1.3:** Serialize/deserialize game state
- [ ] **Subtask 4.4.1.4:** Handle state updates atomically

#### Task 4.4.2: Disconnection Handling
- [ ] **Subtask 4.4.2.1:** Detect player disconnection
- [ ] **Subtask 4.4.2.2:** Hold turn for 30 seconds on disconnect
- [ ] **Subtask 4.4.2.3:** Auto-pass if not reconnected
- [ ] **Subtask 4.4.2.4:** Notify other players of disconnection
- [ ] **Subtask 4.4.2.5:** Handle reconnection (restore game state)

#### Task 4.4.3: Optimistic Updates & Rollback
- [ ] **Subtask 4.4.3.1:** Implement optimistic UI updates on client
- [ ] **Subtask 4.4.3.2:** Rollback on server validation failure
- [ ] **Subtask 4.4.3.3:** Show error messages for invalid moves

---

## Epic 5: User Authentication & Management

### Story 5.1: User Registration & Login (Backend)

#### Task 5.1.1: Registration System (Backend)
- [x] **Subtask 5.1.1.1:** Implement password hashing (bcrypt)
- [x] **Subtask 5.1.1.2:** Validate unique username/email
- [x] **Subtask 5.1.1.3:** Create user in database
- [x] **Subtask 5.1.1.4:** Return JWT token on success

#### Task 5.1.2: Login System (Backend)
- [x] **Subtask 5.1.2.1:** Verify password
- [x] **Subtask 5.1.2.2:** Generate JWT token
- [x] **Subtask 5.1.2.3:** Return token and user info

#### Task 5.1.3: Session Management (Frontend)
- [ ] **Subtask 5.1.3.1:** Store token in localStorage/cookies
- [ ] **Subtask 5.1.3.2:** Implement token refresh logic
- [ ] **Subtask 5.1.3.3:** Handle token expiration
- [ ] **Subtask 5.1.3.4:** Create logout function
- [ ] **Subtask 5.1.3.5:** Sync token with Redux auth slice

### Story 5.2: User Profile (Backend API)

#### Task 5.2.1: Profile API Endpoints
- [ ] **Subtask 5.2.1.1:** GET /api/users/:id/stats (user statistics)
- [ ] **Subtask 5.2.1.2:** GET /api/users/:id/games (user game history)
- [ ] **Subtask 5.2.1.3:** PUT /api/users/:id (update profile)
- [ ] **Subtask 5.2.1.4:** PUT /api/users/:id/password (change password)

---

## Epic 5.5: Frontend State Management

### Story 5.5.1: Redux Store Setup

#### Task 5.5.1.1: Redux Slices Implementation
- [x] **Subtask 5.5.1.1:** Create `uiSlice` for UI state
  - Navigation state (sidebarOpen, bottomMenuActiveItem)
  - Modal state (currentModal, modalStack)
  - Theme and appearance preferences
  - Notifications array
  - Loading states (page transitions, dragging)
  - Form drafts
  - UI preferences (sound, animations, card display)
- [x] **Subtask 5.5.1.2:** Create `gameSlice` for game UI state
  - Current context (currentTableId, currentGameId)
  - WebSocket connection state (isConnected, connectionError)
  - Game UI state (selectedCards, isSortingHand, showSuggestions)
  - Turn UI state (turnTimer, isMyTurn, canPlay, canPass)
  - Game board UI (animations, optimistic updates)
- [x] **Subtask 5.5.1.3:** Create `authSlice` for authentication UI state
  - Authentication status (isAuthenticated, token, tokenExpiry)
  - Auth form drafts (loginForm, registerForm)
  - Auth flow state (isLoggingIn, isRegistering, authError)
- [x] **Subtask 5.5.1.4:** Configure Redux store with all slices
- [x] **Subtask 5.5.1.5:** Set up Redux persist for critical UI state (theme, preferences)

### Story 5.5.2: TanStack Query Setup

#### Task 5.5.2.1: Query Keys Factory
- [x] **Subtask 5.5.2.1:** Create query keys factory pattern
  - User queries (all, detail, me, stats, games)
  - Table queries (all, detail, players)
  - Game queries (all, detail, history)
  - Bot queries (all, detail, myBots)
  - Session queries (all, detail, summary)
- [x] **Subtask 5.5.2.2:** Configure TanStack Query client
- [x] **Subtask 5.5.2.3:** Set up query client provider

#### Task 5.5.2.2: User Queries
- [x] **Subtask 5.5.2.2.1:** Implement `useCurrentUser` query
- [x] **Subtask 5.5.2.2.2:** Implement `useUserStats` query
- [x] **Subtask 5.5.2.2.3:** Implement `useUserGames` infinite query

#### Task 5.5.2.3: Table Queries
- [x] **Subtask 5.5.2.3.1:** Implement `useTables` infinite query (with pagination and filtering support)
- [x] **Subtask 5.5.2.3.2:** Implement `useTable` query
- [x] **Subtask 5.5.2.3.3:** Implement `useTablePlayers` query
- [x] **Subtask 5.5.2.3.4:** Implement `useTablesPaginated` query (page-based pagination)

#### Task 5.5.2.4: Game Queries
- [x] **Subtask 5.5.2.4.1:** Implement `useGame` query
- [x] **Subtask 5.5.2.4.2:** Implement `useGameHistory` query

#### Task 5.5.2.5: Bot Queries
- [x] **Subtask 5.5.2.5.1:** Implement `useMyBots` query
- [x] **Subtask 5.5.2.5.2:** Implement `useBot` query

#### Task 5.5.2.6: Session Queries
- [x] **Subtask 5.5.2.6.1:** Implement `useSession` query
- [x] **Subtask 5.5.2.6.2:** Implement `useSessionSummary` query

#### Task 5.5.2.7: Mutations
- [x] **Subtask 5.5.2.7.1:** Implement user mutations (updateProfile, changePassword)
- [x] **Subtask 5.5.2.7.2:** Implement table mutations (createTable, joinTable, leaveTable)
- [x] **Subtask 5.5.2.7.3:** Implement bot mutations (createBot, updateBot, deleteBot)
- [x] **Subtask 5.5.2.7.4:** Set up query invalidation on mutations

### Story 5.5.3: WebSocket State Integration

#### Task 5.5.3.1: WebSocket Connection Management
- [x] **Subtask 5.5.3.1.1:** Create WebSocket service/hook
- [x] **Subtask 5.5.3.1.2:** Update Redux gameSlice with connection state
- [x] **Subtask 5.5.3.1.3:** Handle WebSocket events and update TanStack Query cache
  - `table_updated` → Invalidate table queries
  - `player_joined` → Invalidate player queries
  - `game_state_update` → Update Redux gameSlice (optimistic) and sync with server

## Epic 6: Table Management System

### Story 6.1: Table Creation

#### Task 6.1.1: Create Table UI
- [ ] **Subtask 6.1.1.1:** Create table creation form
- [ ] **Subtask 6.1.1.2:** Player count selector (2-4)
- [ ] **Subtask 6.1.1.3:** Game mode selector (Casual, Bot Arena, Hybrid, Practice)
- [ ] **Subtask 6.1.1.4:** Session length selector (16 or 32 games)
- [ ] **Subtask 6.1.1.5:** Visibility option (public/private)
- [ ] **Subtask 6.1.1.6:** Table name input (optional)

#### Task 6.1.2: Table Creation Logic
- [ ] **Subtask 6.1.2.1:** Generate unique table ID
- [ ] **Subtask 6.1.2.2:** Create table in database
- [ ] **Subtask 6.1.2.3:** Create shareable link
- [ ] **Subtask 6.1.2.4:** Set host as first player
- [ ] **Subtask 6.1.2.5:** Initialize table state

### Story 6.2: Table Lobby

#### Task 6.2.1: Lobby UI Layout
- [ ] **Subtask 6.2.1.1:** Create lobby page component
- [ ] **Subtask 6.2.1.2:** Player slots display (4 slots)
- [ ] **Subtask 6.2.1.3:** Show empty/human/bot status per slot
- [ ] **Subtask 6.2.1.4:** Ready status indicators
- [ ] **Subtask 6.2.1.5:** Table settings panel
- [ ] **Subtask 6.2.1.6:** Shareable link display with copy button
- [ ] **Subtask 6.2.1.7:** Chat panel

#### Task 6.2.2: Lobby Functionality
- [ ] **Subtask 6.2.2.1:** Join table via link
- [ ] **Subtask 6.2.2.2:** Assign player to slot
- [ ] **Subtask 6.2.2.3:** Ready/unready toggle
- [ ] **Subtask 6.2.2.4:** Add bot to slot (host only)
- [ ] **Subtask 6.2.2.5:** Remove player/bot (host only)
- [ ] **Subtask 6.2.2.6:** Start game button (host only, all ready)
- [ ] **Subtask 6.2.2.7:** Leave table button

#### Task 6.2.3: Lobby Chat
- [ ] **Subtask 6.2.3.1:** Chat input field
- [ ] **Subtask 6.2.3.2:** Send message functionality
- [ ] **Subtask 6.2.3.3:** Display messages
- [ ] **Subtask 6.2.3.4:** System messages (player joined/left)

### Story 6.3: Table State Management

#### Task 6.3.1: Table State Model
- [ ] **Subtask 6.3.1.1:** Define table state structure
- [ ] **Subtask 6.3.1.2:** Track table status (Waiting, Ready, In Progress, Completed)
- [ ] **Subtask 6.3.1.3:** Manage player list
- [ ] **Subtask 6.3.1.4:** Track bot assignments

#### Task 6.3.2: State Synchronization
- [ ] **Subtask 6.3.2.1:** Broadcast state changes via WebSocket
- [ ] **Subtask 6.3.2.2:** Handle state updates on client
- [ ] **Subtask 6.3.2.3:** Persist state to database

---

## Epic 7: Game UI & Frontend Components

### Story 7.1: Main Application Layout & Navigation

#### Task 7.1.1: Bottom Menu Bar (Primary Navigation)
- [ ] **Subtask 7.1.1.1:** Create bottom menu bar component (always visible on mobile)
- [ ] **Subtask 7.1.1.2:** Implement User icon/button (left position)
  - Show login/signup when logged out
  - Show user avatar/username when logged in
  - Navigate to login page or profile page
- [ ] **Subtask 7.1.1.3:** Implement Tables icon/button (center position)
  - Navigate to table list page
  - Show active state when on table list
  - Show badge for active tables
- [ ] **Subtask 7.1.1.4:** Implement My Bot icon/button (right position)
  - Navigate to bot editor page
  - Show "Coming Soon" badge if not implemented
  - Disabled state with visual indicator
- [ ] **Subtask 7.1.1.5:** Add active state indicators for menu items
- [ ] **Subtask 7.1.1.6:** Implement responsive behavior (always visible on mobile, optional on desktop)
- [ ] **Subtask 7.1.1.7:** Add user profile menu/drawer (when logged in)
  - View Profile option
  - Game History option
  - Settings option
  - Logout option

#### Task 7.1.2: Top Bar / Header (Optional)
- [ ] **Subtask 7.1.2.1:** Create top bar component (optional, context-dependent)
- [ ] **Subtask 7.1.2.2:** Add back button functionality
- [ ] **Subtask 7.1.2.3:** Add page title display
- [ ] **Subtask 7.1.2.4:** Add settings/actions menu (context-specific)
- [ ] **Subtask 7.1.2.5:** Add share button (for table pages)

#### Task 7.1.3: Landing Page (Future Implementation)
- [ ] **Subtask 7.1.3.1:** Create landing page component (`LandingPage.tsx`)
- [ ] **Subtask 7.1.3.2:** Add game introduction and rules overview
- [ ] **Subtask 7.1.3.3:** Add call-to-action buttons (Get Started, Learn More)
- [ ] **Subtask 7.1.3.4:** Add feature highlights section
- [ ] **Subtask 7.1.3.5:** Add screenshots/demo section
- [ ] **Subtask 7.1.3.6:** Add navigation to login/register or table list
- [ ] **Subtask 7.1.3.7:** Update root route to show landing page (currently redirects to `/tables`)

### Story 7.2: Table List Page

#### Task 7.2.1: Table List Page Layout
- [ ] **Subtask 7.2.1.1:** Create `TableListPage.tsx` component
- [ ] **Subtask 7.2.1.2:** Add table list header with "Create Table" button
- [ ] **Subtask 7.2.1.3:** Add filter/search controls
- [ ] **Subtask 7.2.1.4:** Implement responsive grid layout (2-3 columns on mobile, 3-4 on desktop)
- [ ] **Subtask 7.2.1.5:** Add pagination controls (prev/next, page numbers)
- [ ] **Subtask 7.2.1.6:** Add infinite scroll option (optional)
- [ ] **Subtask 7.2.1.7:** Ensure bottom menu bar is visible

#### Task 7.2.2: Table Card Component
- [ ] **Subtask 7.2.2.1:** Create table card component
- [ ] **Subtask 7.2.2.2:** Display table name (or "Table #123")
- [ ] **Subtask 7.2.2.3:** Display player count (e.g., "2/4 players")
- [ ] **Subtask 7.2.2.4:** Add status badges (🟢 Waiting, 🟡 In Progress, ⚪ Full)
- [ ] **Subtask 7.2.2.5:** Display game mode (Casual, Bot Arena, Hybrid, Practice)
- [ ] **Subtask 7.2.2.6:** Display host avatar/name
- [ ] **Subtask 7.2.2.7:** Add join button (if not full and user not in table)
- [ ] **Subtask 7.2.2.8:** Add info icon for table details

#### Task 7.2.3: Table List Functionality
- [ ] **Subtask 7.2.3.1:** Implement table creation modal/form (`CreateTableModal.tsx`)
  - Create full-screen modal component (mobile) / centered modal (desktop)
  - Add header with back button, "Create Table" title, and close button
  - Implement table name input field (optional, max 50 chars, with helper text)
  - Implement player count selector (2, 3, or 4 players, default: 4, radio buttons or segmented control)
  - Implement game mode selector (Casual, Bot Arena, Hybrid, Practice, default: Casual, card-style selection with icons)
  - Implement session length selector (16 or 32 games, default: 16, with estimated duration helper text)
  - Implement privacy settings (Public/Private toggle, default: Public)
  - Add Cancel and Create Table buttons
  - Implement form validation (inline and on submit)
  - Add loading state on submit (button disabled, spinner)
  - Handle success (navigate to table lobby, show success notification)
  - Handle errors (display error messages, highlight error fields)
  - Implement swipe to dismiss on mobile (with confirmation if form has changes)
  - Implement keyboard navigation on desktop (Tab, Enter, Escape)
  - Save form draft to Redux (optional, for recovery)
- [ ] **Subtask 7.2.3.2:** Implement join table functionality
  - Navigate to table lobby on join
  - Handle full table error
  - Handle already in table case
- [ ] **Subtask 7.2.3.3:** Implement table details modal
  - Show current players
  - Show game mode
  - Show session progress
  - Show share link
  - Long press or tap info icon on table card to open
- [ ] **Subtask 7.2.3.4:** Implement filter functionality
  - Filter by status (Waiting, In Progress, Full)
  - Filter by game mode
  - Filter by player count
- [ ] **Subtask 7.2.3.5:** Implement search functionality
  - Search by table name
  - Search by host name
- [ ] **Subtask 7.2.3.6:** Implement pagination
  - Load next/previous page
  - Show current page number
  - Handle infinite scroll (optional)

### Story 7.3: Table Lobby Page

#### Task 7.3.1: Table Lobby Layout
- [ ] **Subtask 7.3.1.1:** Create `TableLobbyPage.tsx` component
- [ ] **Subtask 7.3.1.2:** Add top bar with back button, table name, and share button
- [ ] **Subtask 7.3.1.3:** Create player slots grid (2x2 layout for 4 slots)
- [ ] **Subtask 7.3.1.4:** Display player slot component (empty/human/bot status)
- [ ] **Subtask 7.3.1.5:** Add ready status indicators on player slots
- [ ] **Subtask 7.3.1.6:** Add table settings panel
  - Game mode display
  - Session length display
  - Player count display
- [ ] **Subtask 7.3.1.7:** Add action buttons ([Add Bot] [Ready] [Start Game])
- [ ] **Subtask 7.3.1.8:** Ensure bottom menu bar is visible

#### Task 7.3.2: Table Lobby Functionality
- [ ] **Subtask 7.3.2.1:** Implement ready/unready toggle
- [ ] **Subtask 7.3.2.2:** Implement add bot functionality (host only, coming soon - disabled)
  - Bot selection modal
  - Bot list display
- [ ] **Subtask 7.3.2.3:** Implement remove player/bot (host only)
  - Long press on player slot
  - Confirmation dialog
- [ ] **Subtask 7.3.2.4:** Implement start game button (host only)
  - Enable when all slots filled and all players ready
  - Navigate to game board on start
- [ ] **Subtask 7.3.2.5:** Implement leave table functionality
  - Confirmation dialog
  - Navigate back to table list
- [ ] **Subtask 7.3.2.6:** Implement share table functionality
  - Copy table link to clipboard
  - Show share options (if available)

### Story 7.4: Authentication Pages

#### Task 7.4.1: Login Page
- [x] **Subtask 7.4.1.1:** Create `LoginPage.tsx` component
- [x] **Subtask 7.4.1.2:** Add username input field
- [x] **Subtask 7.4.1.3:** Add password input field
- [x] **Subtask 7.4.1.4:** Add login button
- [x] **Subtask 7.4.1.5:** Add "Sign Up" link/button
- [x] **Subtask 7.4.1.6:** Implement form validation
- [x] **Subtask 7.4.1.7:** Handle login success (store token, update state, redirect)
- [x] **Subtask 7.4.1.8:** Display error messages

#### Task 7.4.2: Registration Page
- [x] **Subtask 7.4.2.1:** Create `RegisterPage.tsx` component
- [x] **Subtask 7.4.2.2:** Add username input field
- [x] **Subtask 7.4.2.3:** Add email input field
- [x] **Subtask 7.4.2.4:** Add password input field
- [x] **Subtask 7.4.2.5:** Add confirm password input field
- [x] **Subtask 7.4.2.6:** Add "Create Account" button
- [x] **Subtask 7.4.2.7:** Add "Login" link/button
- [x] **Subtask 7.4.2.8:** Implement form validation
- [x] **Subtask 7.4.2.9:** Handle registration success (auto-login, redirect to table list)
- [x] **Subtask 7.4.2.10:** Display error messages

### Story 7.5: User Profile / Info Page

#### Task 7.5.1: Profile Page Layout
- [ ] **Subtask 7.5.1.1:** Create `UserInfoPage.tsx` or `ProfilePage.tsx` component
- [ ] **Subtask 7.5.1.2:** Add top bar with back button, "Profile" title, and settings icon
- [ ] **Subtask 7.5.1.3:** Create profile header section
  - User avatar/profile picture
  - Username display
  - User ID or handle
  - Account creation date
  - Online/offline status (if applicable)
- [ ] **Subtask 7.5.1.4:** Create statistics section
  - Games Played count
  - Games Won count
  - Win Rate percentage
  - Total Points
  - Best Score
  - Average Score
  - Current Rank (if leaderboard exists)
- [ ] **Subtask 7.5.1.5:** Create "My Bots" section
  - Bot count display
  - Link to Bot Editor page
  - "Coming Soon" indicator if not available
- [ ] **Subtask 7.5.1.6:** Create "Recent Games" section
  - List of last 3-5 games
  - Game ID, date, result (Won/Lost), points
  - Link to full game history
- [ ] **Subtask 7.5.1.7:** Add action buttons ([Edit Profile] [Change Password])
- [ ] **Subtask 7.5.1.8:** Ensure bottom menu bar is visible

#### Task 7.5.2: Profile Page Functionality
- [ ] **Subtask 7.5.2.1:** Implement edit profile functionality
  - Edit form modal/page
  - Update username (if allowed)
  - Update avatar/profile picture
  - Update bio/description (if applicable)
  - Update display preferences
- [ ] **Subtask 7.5.2.2:** Implement change password functionality
  - Password change form
  - Current password validation
  - New password strength validation
- [ ] **Subtask 7.5.2.3:** Implement view game history
  - Navigate to game history page
  - Paginated list of all games
  - Filter by date, result, points
  - View game details/replay
- [ ] **Subtask 7.5.2.4:** Implement logout functionality
  - Confirmation dialog
  - Clear authentication token
  - Redirect to login or table list
- [ ] **Subtask 7.5.2.5:** Add mobile-optimized features
  - Swipe gestures for navigation
  - Pull to refresh statistics
  - Collapsible sections
  - Long press on avatar to change picture

#### Task 7.5.3: Settings Menu (Optional)
- [ ] **Subtask 7.5.3.1:** Create settings menu/drawer
- [ ] **Subtask 7.5.3.2:** Add account settings section
  - Edit profile
  - Change password
  - Email preferences
  - Notification settings
- [ ] **Subtask 7.5.3.3:** Add game settings section
  - Sound effects toggle
  - Animation preferences
  - Card display options
  - Language selection
- [ ] **Subtask 7.5.3.4:** Add privacy settings section
  - Profile visibility
  - Game history visibility
  - Data sharing preferences

### Story 7.6: Card Components

#### Task 7.6.1: Card Visual Component
- [ ] **Subtask 7.6.1.1:** Create Card component (SVG or image-based)
- [ ] **Subtask 7.6.1.2:** Display rank and suit
- [ ] **Subtask 7.6.1.3:** Card styling (back, face, selected state)
- [ ] **Subtask 7.6.1.4:** Hover effects
- [ ] **Subtask 7.6.1.5:** Animation support (flip, slide)

#### Task 7.6.2: Hand Display Component
- [ ] **Subtask 7.6.2.1:** Create Hand component
- [ ] **Subtask 7.6.2.2:** Display cards horizontally
- [ ] **Subtask 7.6.2.3:** Click-to-select functionality
- [ ] **Subtask 7.6.2.4:** Visual feedback for selected cards
- [ ] **Subtask 7.6.2.5:** Auto-sort functionality
- [ ] **Subtask 7.6.2.6:** Selected cards counter

#### Task 7.6.3: Opponent Hand Display
- [ ] **Subtask 7.6.3.1:** Show card back for opponents
- [ ] **Subtask 7.6.3.2:** Display card count
- [ ] **Subtask 7.6.3.3:** Last played cards display
- [ ] **Subtask 7.6.3.4:** Toggle to show/hide count (optional)

### Story 7.7: Game Board Screen

#### Task 7.7.1: Game Board Layout (Mobile-Optimized)
- [ ] **Subtask 7.7.1.1:** Create `GameBoardPage.tsx` component
- [ ] **Subtask 7.7.1.2:** Add top bar with round number, game number (Game X/16), and settings icon
- [ ] **Subtask 7.7.1.3:** Position players (mobile-optimized layout)
  - Opponent 1 (Top)
  - Opponent 2 (Left)
  - Opponent 3 (Right)
  - Your hand (Bottom)
- [ ] **Subtask 7.7.1.4:** Create center play area for last played cards
- [ ] **Subtask 7.7.1.5:** Add action buttons bar ([Play] [Pass] [Sort] [Suggest])
- [ ] **Subtask 7.7.1.6:** Ensure bottom menu bar is visible
- [ ] **Subtask 7.7.1.7:** Implement responsive layout for 2-3 players
- [ ] **Subtask 7.7.1.8:** Optimize for mobile touch interactions

#### Task 7.7.2: Player Information Display
- [ ] **Subtask 7.7.2.1:** Display player name/bot indicator for each opponent
- [ ] **Subtask 7.7.2.2:** Display cards remaining count for each opponent
- [ ] **Subtask 7.7.2.3:** Display last action for each player
- [ ] **Subtask 7.7.2.4:** Add turn indicator (highlight current player)
- [ ] **Subtask 7.7.2.5:** Add turn timer display (30s countdown)

#### Task 7.7.3: Center Play Area
- [ ] **Subtask 7.7.3.1:** Display last played cards in center area
- [ ] **Subtask 7.7.3.2:** Show combination type label
- [ ] **Subtask 7.7.3.3:** Show "Round won" message
- [ ] **Subtask 7.7.3.4:** Add animations for card plays
- [ ] **Subtask 7.7.3.5:** Clear play area on new round

#### Task 7.7.4: Action Buttons & User Interactions
- [ ] **Subtask 7.7.4.1:** Implement card selection (tap to select/deselect)
- [ ] **Subtask 7.7.4.2:** Add Play button (enabled when valid move selected)
- [ ] **Subtask 7.7.4.3:** Add Pass button
- [ ] **Subtask 7.7.4.4:** Add Auto-sort button (sorts hand by rank and suit)
- [ ] **Subtask 7.7.4.5:** Add Suggestion button (highlights valid moves, shows combination type)
- [ ] **Subtask 7.7.4.6:** Implement button states (disabled/enabled based on game state)
- [ ] **Subtask 7.7.4.7:** Add move validation and error messages

#### Task 7.7.5: Sidebar/Settings Panel
- [ ] **Subtask 7.7.5.1:** Create settings sidebar (opens from settings icon)
- [ ] **Subtask 7.7.5.2:** Add game log panel
- [ ] **Subtask 7.7.5.3:** Add chat panel
- [ ] **Subtask 7.7.5.4:** Add score board (current game points)
- [ ] **Subtask 7.7.5.5:** Add session score board (accumulated points)
- [ ] **Subtask 7.7.5.6:** Add leave game option
- [ ] **Subtask 7.7.5.7:** Implement collapsible panels

### Story 7.8: Post-Game Screen

#### Task 7.8.1: Result Display
- [ ] **Subtask 7.8.1.1:** Winner announcement
- [ ] **Subtask 7.8.1.2:** Player rankings
- [ ] **Subtask 7.8.1.3:** Score breakdown per player
- [ ] **Subtask 7.8.1.4:** Detailed stats (cards left, penalties, etc.)
- [ ] **Subtask 7.8.1.5:** Visual card reveal (all hands)

#### Task 7.8.2: Post-Game Actions
- [ ] **Subtask 7.8.2.1:** Play Again button (next game in session)
- [ ] **Subtask 7.8.2.2:** Back to Lobby button
- [ ] **Subtask 7.8.2.3:** Share result button (copyable text)
- [ ] **Subtask 7.8.2.4:** View Replay button (future)

### Story 7.9: Session Summary Screen

#### Task 7.9.1: Session Summary Display
- [ ] **Subtask 7.9.1.1:** Final ranking display
- [ ] **Subtask 7.9.1.2:** Total points per player
- [ ] **Subtask 7.9.1.3:** Session winner announcement
- [ ] **Subtask 7.9.1.4:** Detailed breakdown (points per game)
- [ ] **Subtask 7.9.1.5:** Expandable game-by-game view

#### Task 7.9.2: Session Summary Actions
- [ ] **Subtask 7.9.2.1:** Create New Table button
- [ ] **Subtask 7.9.2.2:** View Game History button
- [ ] **Subtask 7.9.2.3:** Share Results button

---

## Epic 8: Bot Development System

### Story 8.1: Bot Editor Interface

#### Task 8.1.1: Bot Editor Layout
- [ ] **Subtask 8.1.1.1:** Create bot editor page
- [ ] **Subtask 8.1.1.2:** Left panel: Bot management (30% width)
- [ ] **Subtask 8.1.1.3:** Center panel: Code editor (50% width)
- [ ] **Subtask 8.1.1.4:** Right panel: Docs & tools (20% width)
- [ ] **Subtask 8.1.1.5:** Responsive layout

#### Task 8.1.2: Monaco Editor Integration
- [ ] **Subtask 8.1.2.1:** Install @monaco-editor/react
- [ ] **Subtask 8.1.2.2:** Configure Monaco Editor
- [ ] **Subtask 8.1.2.3:** JavaScript syntax highlighting
- [ ] **Subtask 8.1.2.4:** Line numbers
- [ ] **Subtask 8.1.2.5:** Auto-completion setup
- [ ] **Subtask 8.1.2.6:** Code formatting

#### Task 8.1.3: Bot Template & Examples
- [ ] **Subtask 8.1.3.1:** Create default bot template
- [ ] **Subtask 8.1.3.2:** Create example bots (random, greedy, defensive)
- [ ] **Subtask 8.1.3.3:** Template code with getNextMove function
- [ ] **Subtask 8.1.3.4:** Load template on new bot creation

### Story 8.2: Bot Management

#### Task 8.2.1: Bot List Panel
- [ ] **Subtask 8.2.1.1:** Display user's bots list
- [ ] **Subtask 8.2.1.2:** Bot name, last modified, description
- [ ] **Subtask 8.2.1.3:** Create New Bot button
- [ ] **Subtask 8.2.1.4:** Select bot functionality
- [ ] **Subtask 8.2.1.5:** Delete bot functionality

#### Task 8.2.2: Bot CRUD Operations
- [ ] **Subtask 8.2.2.1:** Create bot (name, code, description)
- [ ] **Subtask 8.2.2.2:** Save bot (update existing)
- [ ] **Subtask 8.2.2.3:** Load bot code into editor
- [ ] **Subtask 8.2.2.4:** Delete bot with confirmation
- [ ] **Subtask 8.2.2.5:** Validate bot name uniqueness

#### Task 8.2.3: Bot Selection in Table Creation
- [ ] **Subtask 8.2.3.1:** Show bot selector in table creation
- [ ] **Subtask 8.2.3.2:** Assign bot to player slot
- [ ] **Subtask 8.2.3.3:** Multiple bot selection (for multiple slots)

### Story 8.3: Bot API & Documentation

#### Task 8.3.1: API Documentation Panel
- [ ] **Subtask 8.3.1.1:** Create API reference documentation
- [ ] **Subtask 8.3.1.2:** Document gameState object structure
- [ ] **Subtask 8.3.1.3:** Document return object format
- [ ] **Subtask 8.3.1.4:** Show valid combination types
- [ ] **Subtask 8.3.1.5:** Code examples

#### Task 8.3.2: Helper Functions
- [ ] **Subtask 8.3.2.1:** Create utility functions for bots
- [ ] **Subtask 8.3.2.2:** Filter valid moves helper
- [ ] **Subtask 8.3.2.3:** Card comparison helpers
- [ ] **Subtask 8.3.2.4:** Make helpers available in bot execution context

### Story 8.4: Bot Testing System

#### Task 8.4.1: Test Bot Functionality
- [ ] **Subtask 8.4.1.1:** Create Test Bot button
- [ ] **Subtask 8.4.1.2:** Generate sample game states
- [ ] **Subtask 8.4.1.3:** Execute bot code in Web Worker
- [ ] **Subtask 8.4.1.4:** Validate return format
- [ ] **Subtask 8.4.1.5:** Display test results

#### Task 8.4.2: Bot Console
- [ ] **Subtask 8.4.2.1:** Create console output panel
- [ ] **Subtask 8.4.2.2:** Capture console.log from bot
- [ ] **Subtask 8.4.2.3:** Display errors
- [ ] **Subtask 8.4.2.4:** Show execution logs
- [ ] **Subtask 8.4.2.5:** Clear console functionality

#### Task 8.4.3: Practice Mode Integration
- [ ] **Subtask 8.4.3.1:** Create practice mode setup
- [ ] **Subtask 8.4.3.2:** Select bot for practice
- [ ] **Subtask 8.4.3.3:** Fill remaining slots with rule-based AIs
- [ ] **Subtask 8.4.3.4:** Start practice game
- [ ] **Subtask 8.4.3.5:** Observe bot behavior

### Story 8.5: Bot Execution Environment

#### Task 8.5.1: Web Worker Setup
- [ ] **Subtask 8.5.1.1:** Create Web Worker for bot execution
- [ ] **Subtask 8.5.1.2:** Set up sandboxed environment
- [ ] **Subtask 8.5.1.3:** Inject gameState into worker
- [ ] **Subtask 8.5.1.4:** Execute bot code
- [ ] **Subtask 8.5.1.5:** Capture return value

#### Task 8.5.2: Safety & Constraints
- [ ] **Subtask 8.5.2.1:** Implement 5-second timeout
- [ ] **Subtask 8.5.2.2:** Auto-pass on timeout
- [ ] **Subtask 8.5.2.3:** Track timeout strikes (3 = DQ)
- [ ] **Subtask 8.5.2.4:** Error handling (invalid return = auto-pass)
- [ ] **Subtask 8.5.2.5:** Restrict dangerous APIs (eval, Function, etc.)

#### Task 8.5.3: Bot Integration in Game
- [ ] **Subtask 8.5.3.1:** Call bot on bot's turn
- [ ] **Subtask 8.5.3.2:** Wait for bot response
- [ ] **Subtask 8.5.3.3:** Validate bot move
- [ ] **Subtask 8.5.3.4:** Execute bot move
- [ ] **Subtask 8.5.3.5:** Show bot thinking indicator

---

## Epic 9: Game Flow & Session Management

### Story 9.1: Game Session Flow

#### Task 9.1.1: Session Initialization
- [ ] **Subtask 9.1.1.1:** Initialize session with 16/32 games
- [ ] **Subtask 9.1.1.2:** Track current game number
- [ ] **Subtask 9.1.1.3:** Initialize session scores
- [ ] **Subtask 9.1.1.4:** Create session in database

#### Task 9.1.2: Game-to-Game Transition
- [ ] **Subtask 9.1.2.1:** After game ends, calculate scores
- [ ] **Subtask 9.1.2.2:** Accumulate scores to session totals
- [ ] **Subtask 9.1.2.3:** Check if session complete (16/32 games)
- [ ] **Subtask 9.1.2.4:** Start next game or show session summary
- [ ] **Subtask 9.1.2.5:** Handle player leaving mid-session

#### Task 9.1.3: Session Completion
- [ ] **Subtask 9.1.3.1:** Detect all games completed
- [ ] **Subtask 9.1.3.2:** Calculate final session rankings
- [ ] **Subtask 9.1.3.3:** Show session summary screen
- [ ] **Subtask 9.1.3.4:** Save session to database
- [ ] **Subtask 9.1.3.5:** Offer to create new session

### Story 9.2: Game State Persistence

#### Task 9.2.1: In-Memory Game State
- [ ] **Subtask 9.2.1.1:** Create GameState class
- [ ] **Subtask 9.2.1.2:** Store game state in memory during play
- [ ] **Subtask 9.2.1.3:** Update state on each move
- [ ] **Subtask 9.2.1.4:** Handle server restart (MVP: state loss)

#### Task 9.2.2: Game Logging
- [ ] **Subtask 9.2.2.1:** Log all moves per game
- [ ] **Subtask 9.2.2.2:** Log round transitions
- [ ] **Subtask 9.2.2.3:** Log penalties and scores
- [ ] **Subtask 9.2.2.4:** Store game log in database

---

## Epic 10: Testing & Quality Assurance

### Story 10.1: Unit Testing

#### Task 10.1.1: Game Engine Tests
- [ ] **Subtask 10.1.1.1:** Test card ranking and comparison
- [ ] **Subtask 10.1.1.2:** Test combination detection
- [ ] **Subtask 10.1.1.3:** Test move validation
- [ ] **Subtask 10.1.1.4:** Test cutting rules
- [ ] **Subtask 10.1.1.5:** Test scoring calculations
- [ ] **Subtask 10.1.1.6:** Test instant win conditions

#### Task 10.1.2: API Endpoint Tests
- [ ] **Subtask 10.1.2.1:** Test authentication endpoints
- [ ] **Subtask 10.1.2.2:** Test bot CRUD endpoints
- [x] **Subtask 10.1.2.3:** Test table management endpoints (with pagination and filtering tests)
- [ ] **Subtask 10.1.2.4:** Test error handling

#### Task 10.1.3: Component Tests
- [ ] **Subtask 10.1.3.1:** Test card components
- [ ] **Subtask 10.1.3.2:** Test game board components
- [ ] **Subtask 10.1.3.3:** Test bot editor components

#### Task 10.1.4: State Management Tests
- [x] **Subtask 10.1.4.1:** Test Redux slices (uiSlice, gameSlice, authSlice)
- [x] **Subtask 10.1.4.2:** Test API service
- [x] **Subtask 10.1.4.3:** Test query keys factory
- [x] **Subtask 10.1.4.4:** Test store configuration

### Story 10.2: Integration Testing

#### Task 10.2.1: WebSocket Integration Tests
- [ ] **Subtask 10.2.1.1:** Test table creation flow
- [ ] **Subtask 10.2.1.2:** Test player join/leave
- [ ] **Subtask 10.2.1.3:** Test gameplay events
- [ ] **Subtask 10.2.1.4:** Test state synchronization

#### Task 10.2.2: End-to-End Game Flow Tests
- [ ] **Subtask 10.2.2.1:** Test complete game flow (human vs human)
- [ ] **Subtask 10.2.2.2:** Test bot gameplay flow
- [ ] **Subtask 10.2.2.3:** Test session completion flow
- [ ] **Subtask 10.2.2.4:** Test edge cases and error scenarios

### Story 10.3: Performance Testing

#### Task 10.3.1: Load Testing
- [ ] **Subtask 10.3.1.1:** Test multiple concurrent games
- [ ] **Subtask 10.3.1.2:** Test WebSocket connection limits
- [ ] **Subtask 10.3.1.3:** Test database query performance
- [ ] **Subtask 10.3.1.4:** Optimize slow queries

#### Task 10.3.2: Bot Performance Testing
- [ ] **Subtask 10.3.2.1:** Test bot execution time
- [ ] **Subtask 10.3.2.2:** Test multiple bots in same game
- [ ] **Subtask 10.3.2.3:** Test bot timeout handling

---

## Epic 11: Deployment & DevOps

### Story 11.1: Build & Deployment Setup

#### Task 11.1.1: Frontend Build Configuration
- [ ] **Subtask 11.1.1.1:** Configure Vite build
- [ ] **Subtask 11.1.1.2:** Optimize bundle size
- [ ] **Subtask 11.1.1.3:** Set up environment variables
- [ ] **Subtask 11.1.1.4:** Create production build script

#### Task 11.1.2: Backend Build Configuration
- [ ] **Subtask 11.1.2.1:** Configure production build
- [ ] **Subtask 11.1.2.2:** Set up PM2 or similar process manager
- [ ] **Subtask 11.1.2.3:** Configure environment variables
- [ ] **Subtask 11.1.2.4:** Set up database connection pooling

#### Task 11.1.3: Deployment Pipeline
- [ ] **Subtask 11.1.3.1:** Set up CI/CD (GitHub Actions)
- [ ] **Subtask 11.1.3.2:** Deploy frontend to Vercel/Netlify
- [ ] **Subtask 11.1.3.3:** Deploy backend to Railway/Render
- [ ] **Subtask 11.1.3.4:** Set up database (Neon or Supabase)
- [ ] **Subtask 11.1.3.5:** Configure DNS and SSL

### Story 11.2: Monitoring & Analytics

#### Task 11.2.1: Error Monitoring
- [ ] **Subtask 11.2.1.1:** Set up Sentry for backend
- [ ] **Subtask 11.2.1.2:** Set up Sentry for frontend
- [ ] **Subtask 11.2.1.3:** Configure error alerts

#### Task 11.2.2: Analytics
- [ ] **Subtask 11.2.2.1:** Set up Plausible/PostHog
- [ ] **Subtask 11.2.2.2:** Track key metrics (games played, bots created)
- [ ] **Subtask 11.2.2.3:** Monitor user engagement

---

## Epic 12: Additional Features & Polish

### Story 12.1: UI/UX Enhancements

#### Task 12.1.1: Animations
- [ ] **Subtask 12.1.1.1:** Card play animations
- [ ] **Subtask 12.1.1.2:** Turn transition animations
- [ ] **Subtask 12.1.1.3:** Round end animations
- [ ] **Subtask 12.1.1.4:** Game end celebrations
- [ ] **Subtask 12.1.1.5:** Loading states

#### Task 12.1.2: Sound Effects (Optional)
- [ ] **Subtask 12.1.2.1:** Card play sounds
- [ ] **Subtask 12.1.2.2:** Turn notification sounds
- [ ] **Subtask 12.1.2.3:** Game end sounds
- [ ] **Subtask 12.1.2.4:** Volume controls

#### Task 12.1.3: Responsive Design (Mobile-First)
- [ ] **Subtask 12.1.3.1:** Mobile optimization (< 768px)
  - Bottom menu bar always visible
  - Single column table list
  - Full-screen modals for forms
  - Swipe gestures for navigation
  - Touch-optimized buttons (min 44x44px)
- [ ] **Subtask 12.1.3.2:** Tablet optimization (768px - 1024px)
  - 2-3 column table grid
  - Sidebar for game info
  - Bottom menu or top navigation
- [ ] **Subtask 12.1.3.3:** Desktop optimization (> 1024px)
  - 3-4 column table grid
  - Top navigation bar (bottom menu optional)
  - Sidebar panels
  - Hover states for interactions
- [ ] **Subtask 12.1.3.4:** Touch-friendly controls
  - Tap for primary actions
  - Long press for secondary actions
  - Swipe for navigation
- [ ] **Subtask 12.1.3.5:** Responsive game board
  - Adapt layout for 2-4 players
  - Mobile-optimized card display
  - Responsive action buttons

### Story 12.2: How to Play Documentation

#### Task 12.2.1: Rules Documentation
- [ ] **Subtask 12.2.1.1:** Create How to Play page
- [ ] **Subtask 12.2.1.2:** Document game rules
- [ ] **Subtask 12.2.1.3:** Document scoring system
- [ ] **Subtask 12.2.1.4:** Add visual examples
- [ ] **Subtask 12.2.1.5:** Add interactive tutorial

#### Task 12.2.2: Bot Development Guide
- [ ] **Subtask 12.2.2.1:** Create bot development guide
- [ ] **Subtask 12.2.2.2:** API documentation
- [ ] **Subtask 12.2.2.3:** Best practices
- [ ] **Subtask 12.2.2.4:** Example bot strategies

---

## Implementation Priority

### Phase 1: MVP (Minimum Viable Product)
1. Epic 1: Project Foundation & Infrastructure
2. Epic 2: Core Game Engine & Rules Implementation (basic combinations, no cutting)
3. Epic 3: Database & Backend Infrastructure (basic)
4. Epic 4: Real-Time Multiplayer System (basic gameplay)
5. Epic 5: User Authentication & Management
6. Epic 6: Table Management System (basic)
7. Epic 7: Game UI & Frontend Components (core gameplay UI)
8. Epic 9: Game Flow & Session Management (single game, no session)

### Phase 2: Core Features
1. Epic 2: Complete game rules (cutting, instant wins, penalties)
2. Epic 8: Bot Development System (basic)
3. Epic 9: Session Management (16/32 games)
4. Epic 7: Complete UI (post-game, session summary)

### Phase 3: Enhanced Features
1. Epic 8: Advanced bot features (testing, examples)
2. Epic 10: Testing & Quality Assurance
3. Epic 11: Deployment & DevOps
4. Epic 12: Additional Features & Polish

### Phase 4: Future Enhancements
- Replay system
- Leaderboards
- Tournaments
- Advanced bot versioning
- Server-side bot sandboxing

---

## Notes

- **Epic 2 (Game Engine)** is the most critical and complex - allocate significant time
- **Testing** should be done incrementally, not all at the end
- **Bot System** can be simplified initially (basic execution, no advanced features)
- **Session Management** can start with single games, then add multi-game sessions
- Prioritize core gameplay first, then add polish and advanced features

---

## Estimated Effort

**Phase 1 (MVP):** 8-12 weeks
**Phase 2 (Core Features):** 6-8 weeks
**Phase 3 (Enhanced Features):** 4-6 weeks
**Phase 4 (Future):** Ongoing

**Total MVP Timeline:** ~14-20 weeks for complete MVP

---

*This document is a living document and should be updated as the project evolves.*

