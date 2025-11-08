-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bots_user_id_idx" ON "bots"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bots_created_at_idx" ON "bots"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "table_sessions_status_idx" ON "table_sessions"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "table_sessions_created_at_idx" ON "table_sessions"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "games_session_id_idx" ON "games"("session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "games_winner_id_idx" ON "games"("winner_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "games_started_at_idx" ON "games"("started_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "game_players_game_id_idx" ON "game_players"("game_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "game_players_user_id_idx" ON "game_players"("user_id");

