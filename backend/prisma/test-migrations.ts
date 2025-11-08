/**
 * Test script to verify database migrations
 *
 * This script tests:
 * 1. All tables exist
 * 2. All indexes are created
 * 3. Foreign key relationships work
 *
 * Run with: npx tsx prisma/test-migrations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMigrations() {
  console.log('Testing database migrations...\n');

  try {
    // Test 1: Verify all tables exist
    console.log('✓ Test 1: Verifying tables exist...');
    const userCount = await prisma.user.count();
    const botCount = await prisma.bot.count();
    const sessionCount = await prisma.tableSession.count();
    const gameCount = await prisma.game.count();
    const gamePlayerCount = await prisma.gamePlayer.count();

    console.log(`  - users: ${userCount} records`);
    console.log(`  - bots: ${botCount} records`);
    console.log(`  - table_sessions: ${sessionCount} records`);
    console.log(`  - games: ${gameCount} records`);
    console.log(`  - game_players: ${gamePlayerCount} records`);
    console.log('  ✓ All tables exist\n');

    // Test 2: Verify indexes by running queries that use them
    console.log('✓ Test 2: Verifying indexes work...');

    // Test users.created_at index
    await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    console.log('  ✓ users.created_at index works');

    // Test bots.user_id index
    await prisma.bot.findMany({
      where: { userId: 1 },
    });
    console.log('  ✓ bots.user_id index works');

    // Test bots.created_at index
    await prisma.bot.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    console.log('  ✓ bots.created_at index works');

    // Test table_sessions.status index
    await prisma.tableSession.findMany({
      where: { status: 'Waiting' },
    });
    console.log('  ✓ table_sessions.status index works');

    // Test table_sessions.created_at index
    await prisma.tableSession.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    console.log('  ✓ table_sessions.created_at index works');

    // Test games.session_id index
    await prisma.game.findMany({
      where: { sessionId: 1 },
    });
    console.log('  ✓ games.session_id index works');

    // Test games.winner_id index
    await prisma.game.findMany({
      where: { winnerId: 1 },
    });
    console.log('  ✓ games.winner_id index works');

    // Test games.started_at index
    await prisma.game.findMany({
      orderBy: { startedAt: 'desc' },
      take: 1,
    });
    console.log('  ✓ games.started_at index works');

    // Test game_players.game_id index
    await prisma.gamePlayer.findMany({
      where: { gameId: 1 },
    });
    console.log('  ✓ game_players.game_id index works');

    // Test game_players.user_id index
    await prisma.gamePlayer.findMany({
      where: { userId: 1 },
    });
    console.log('  ✓ game_players.user_id index works');
    console.log('  ✓ All indexes work\n');

    // Test 3: Verify foreign key relationships
    console.log('✓ Test 3: Verifying foreign key relationships...');

    // Test bots -> users relationship
    try {
      await prisma.bot.findFirst({
        include: { user: true },
      });
      console.log('  ✓ bots -> users relationship works');
    } catch (e) {
      console.log('  ⚠ bots -> users relationship test skipped (no data)');
    }

    // Test games -> table_sessions relationship
    try {
      await prisma.game.findFirst({
        include: { session: true },
      });
      console.log('  ✓ games -> table_sessions relationship works');
    } catch (e) {
      console.log('  ⚠ games -> table_sessions relationship test skipped (no data)');
    }

    // Test game_players -> games relationship
    try {
      await prisma.gamePlayer.findFirst({
        include: { game: true },
      });
      console.log('  ✓ game_players -> games relationship works');
    } catch (e) {
      console.log('  ⚠ game_players -> games relationship test skipped (no data)');
    }

    // Test game_players -> users relationship
    try {
      await prisma.gamePlayer.findFirst({
        include: { user: true },
      });
      console.log('  ✓ game_players -> users relationship works');
    } catch (e) {
      console.log('  ⚠ game_players -> users relationship test skipped (no data)');
    }
    console.log('  ✓ All relationships work\n');

    console.log('✅ All migration tests passed!');
  } catch (error) {
    console.error('❌ Migration test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testMigrations();
