/**
 * Database Seed Script
 *
 * This script populates the database with test data for development and testing.
 *
 * Usage:
 *   npm run db:seed          - Run the seed script
 *   npx prisma db seed       - Alternative way to run the seed
 *
 * What it creates:
 *   - 5 test users (alice, bob, charlie, diana, eve)
 *   - 3 bots (associated with users)
 *   - 4 table sessions (various statuses: Waiting, Ready, In Progress, Completed)
 *   - 4 games (with different states)
 *   - Multiple game players (linking users to games)
 *
 * Test credentials:
 *   All users have the password: password123
 *
 * Note: The script clears all existing data before seeding.
 *       Comment out the cleanup section if you want to preserve existing data.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.gamePlayer.deleteMany();
  await prisma.game.deleteMany();
  await prisma.tableSession.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  console.log('👤 Creating test users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'alice',
        email: 'alice@example.com',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        username: 'bob',
        email: 'bob@example.com',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        username: 'charlie',
        email: 'charlie@example.com',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        username: 'diana',
        email: 'diana@example.com',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        username: 'eve',
        email: 'eve@example.com',
        passwordHash,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create bots for some users
  console.log('🤖 Creating bots...');
  const botCode = `
function playCard(hand, lastPlayed) {
  // Simple bot strategy: play the first valid card
  if (!lastPlayed || lastPlayed.length === 0) {
    return hand[0] ? [hand[0]] : null;
  }
  
  // Try to find a higher card
  const lastValue = lastPlayed[0].value;
  const validCard = hand.find(card => card.value > lastValue);
  
  return validCard ? [validCard] : null;
}
  `.trim();

  const bots = await Promise.all([
    prisma.bot.create({
      data: {
        userId: users[0].id,
        name: 'Alice Bot',
        code: botCode,
        description: 'A simple bot that plays the first valid card',
      },
    }),
    prisma.bot.create({
      data: {
        userId: users[1].id,
        name: 'Bob Bot',
        code: botCode,
        description: "Bob's aggressive bot strategy",
      },
    }),
    prisma.bot.create({
      data: {
        userId: users[0].id,
        name: 'Alice Bot Pro',
        code: botCode,
        description: "Alice's advanced bot",
      },
    }),
  ]);

  console.log(`✅ Created ${bots.length} bots`);

  // Create table sessions
  console.log('🎮 Creating table sessions...');
  const sessions = await Promise.all([
    prisma.tableSession.create({
      data: {
        config: {
          playerCount: 4,
          gameCount: 16,
          timeLimit: 30000,
        },
        status: 'Waiting',
      },
    }),
    prisma.tableSession.create({
      data: {
        config: {
          playerCount: 4,
          gameCount: 32,
          timeLimit: 30000,
        },
        status: 'Ready',
        startedAt: new Date(),
      },
    }),
    prisma.tableSession.create({
      data: {
        config: {
          playerCount: 4,
          gameCount: 16,
          timeLimit: 30000,
        },
        status: 'In Progress',
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
    prisma.tableSession.create({
      data: {
        config: {
          playerCount: 4,
          gameCount: 16,
          timeLimit: 30000,
        },
        status: 'Completed',
        startedAt: new Date(Date.now() - 7200000), // 2 hours ago
        endedAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
  ]);

  console.log(`✅ Created ${sessions.length} table sessions`);

  // Create games
  console.log('🎯 Creating games...');
  const games = await Promise.all([
    // Game in a session (waiting)
    prisma.game.create({
      data: {
        sessionId: sessions[0].id,
        tableId: 'table-waiting-001',
        totalRounds: 0,
        startedAt: new Date(),
      },
    }),
    // Game in a session (in progress)
    prisma.game.create({
      data: {
        sessionId: sessions[2].id,
        tableId: 'table-in-progress-001',
        totalRounds: 5,
        startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
        gameLog: {
          rounds: [
            {
              round: 1,
              plays: [
                { playerId: users[0].id, cards: [{ rank: '3', suit: '♠', value: 1 }] },
                { playerId: users[1].id, cards: [{ rank: '4', suit: '♠', value: 2 }] },
              ],
            },
          ],
        },
      },
    }),
    // Completed game
    prisma.game.create({
      data: {
        sessionId: sessions[3].id,
        tableId: 'table-completed-001',
        winnerId: users[0].id,
        totalRounds: 10,
        scores: {
          [users[0].id]: 150,
          [users[1].id]: 120,
          [users[2].id]: 100,
          [users[3].id]: 80,
        },
        startedAt: new Date(Date.now() - 3600000),
        endedAt: new Date(Date.now() - 1800000),
        gameLog: {
          rounds: Array.from({ length: 10 }, (_, i) => ({
            round: i + 1,
            plays: [],
          })),
        },
      },
    }),
    // Standalone game (no session)
    prisma.game.create({
      data: {
        tableId: 'table-standalone-001',
        totalRounds: 3,
        startedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${games.length} games`);

  // Create game players
  console.log('👥 Creating game players...');
  const gamePlayers = [];

  // Add players to waiting game
  for (let i = 0; i < 2; i++) {
    gamePlayers.push(
      prisma.gamePlayer.create({
        data: {
          gameId: games[0].id,
          userId: users[i].id,
          position: i,
        },
      }),
    );
  }

  // Add players to in-progress game
  for (let i = 0; i < 4; i++) {
    gamePlayers.push(
      prisma.gamePlayer.create({
        data: {
          gameId: games[1].id,
          userId: users[i].id,
          position: i,
        },
      }),
    );
  }

  // Add players to completed game
  for (let i = 0; i < 4; i++) {
    gamePlayers.push(
      prisma.gamePlayer.create({
        data: {
          gameId: games[2].id,
          userId: users[i].id,
          position: i,
          finalScore: (games[2].scores as any)?.[users[i].id] || null,
        },
      }),
    );
  }

  // Add players to standalone game
  for (let i = 0; i < 3; i++) {
    gamePlayers.push(
      prisma.gamePlayer.create({
        data: {
          gameId: games[3].id,
          userId: users[i].id,
          position: i,
        },
      }),
    );
  }

  await Promise.all(gamePlayers);
  console.log(`✅ Created ${gamePlayers.length} game players`);

  console.log('\n✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Bots: ${bots.length}`);
  console.log(`   - Table Sessions: ${sessions.length}`);
  console.log(`   - Games: ${games.length}`);
  console.log(`   - Game Players: ${gamePlayers.length}`);
  console.log('\n🔑 Test credentials:');
  console.log('   All users have password: password123');
  users.forEach((user) => {
    console.log(`   - ${user.username} (${user.email})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
