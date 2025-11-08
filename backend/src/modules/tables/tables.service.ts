import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(userId: number, createTableDto: CreateTableDto) {
    // Default config if not provided
    // Note: userId is not currently stored in TableSession schema
    // but kept for future use or audit logging
    const config = createTableDto.config || {
      playerCount: createTableDto.playerCount || 4,
      gameCount: createTableDto.gameCount || 1,
    };

    const tableSession = await this.prisma.tableSession.create({
      data: {
        config,
        status: 'Waiting',
      },
      select: {
        id: true,
        config: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            tableId: true,
            startedAt: true,
            endedAt: true,
            gamePlayers: {
              select: {
                userId: true,
                position: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return tableSession;
  }

  async findAll() {
    return this.prisma.tableSession.findMany({
      select: {
        id: true,
        config: true,
        status: true,
        startedAt: true,
        endedAt: true,
        createdAt: true,
        updatedAt: true,
        games: {
          where: {
            endedAt: null, // Only active games
          },
          select: {
            id: true,
            tableId: true,
            gamePlayers: {
              select: {
                userId: true,
                position: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const tableSession = await this.prisma.tableSession.findUnique({
      where: { id },
      select: {
        id: true,
        config: true,
        status: true,
        startedAt: true,
        endedAt: true,
        createdAt: true,
        updatedAt: true,
        games: {
          select: {
            id: true,
            tableId: true,
            startedAt: true,
            endedAt: true,
            winnerId: true,
            totalRounds: true,
            gamePlayers: {
              select: {
                userId: true,
                position: true,
                finalScore: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
          orderBy: {
            startedAt: 'desc',
          },
        },
      },
    });

    if (!tableSession) {
      throw new NotFoundException('Table', id);
    }

    return tableSession;
  }

  async join(userId: number, tableId: number) {
    const tableSession = await this.prisma.tableSession.findUnique({
      where: { id: tableId },
      include: {
        games: {
          where: {
            endedAt: null, // Only active games
          },
          include: {
            gamePlayers: true,
          },
          orderBy: {
            startedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!tableSession) {
      throw new NotFoundException('Table', tableId);
    }

    if (tableSession.status === 'Completed') {
      throw new ForbiddenException('Cannot join a completed table session');
    }

    // Check if there's an active game
    const activeGame = tableSession.games[0];

    if (activeGame) {
      // Check if user is already in the game
      const existingPlayer = activeGame.gamePlayers.find((gp) => gp.userId === userId);

      if (existingPlayer) {
        return {
          message: 'Already joined this table',
          tableId,
          gameId: activeGame.id,
        };
      }

      // Check if game is full (assuming max 4 players)
      if (activeGame.gamePlayers.length >= 4) {
        throw new ForbiddenException('Table is full');
      }

      // Add user to existing game
      const position = activeGame.gamePlayers.length;
      await this.prisma.gamePlayer.create({
        data: {
          gameId: activeGame.id,
          userId,
          position,
        },
      });

      return {
        message: 'Joined table successfully',
        tableId,
        gameId: activeGame.id,
        position,
      };
    }

    // No active game, but user can still "join" the session
    // The actual game creation will happen via WebSocket when enough players join
    return {
      message: 'Joined table session. Waiting for game to start.',
      tableId,
      status: tableSession.status,
    };
  }

  async leave(userId: number, tableId: number) {
    const tableSession = await this.prisma.tableSession.findUnique({
      where: { id: tableId },
      include: {
        games: {
          where: {
            endedAt: null, // Only active games
          },
          include: {
            gamePlayers: true,
          },
        },
      },
    });

    if (!tableSession) {
      throw new NotFoundException('Table', tableId);
    }

    // Find and remove user from active games
    let removed = false;
    for (const game of tableSession.games) {
      const playerEntry = game.gamePlayers.find((gp) => gp.userId === userId);
      if (playerEntry) {
        await this.prisma.gamePlayer.delete({
          where: { id: playerEntry.id },
        });
        removed = true;
      }
    }

    if (!removed) {
      return {
        message: 'Not currently in this table',
        tableId,
      };
    }

    // Check if there are any remaining players in active games
    const updatedTableSession = await this.prisma.tableSession.findUnique({
      where: { id: tableId },
      include: {
        games: {
          where: {
            endedAt: null, // Only active games
          },
          include: {
            gamePlayers: true,
          },
        },
      },
    });

    // If no players remain in any active games, delete the table
    const hasRemainingPlayers = updatedTableSession.games.some(
      (game) => game.gamePlayers.length > 0,
    );

    if (!hasRemainingPlayers) {
      await this.prisma.tableSession.delete({
        where: { id: tableId },
      });
      return {
        message: 'Left table successfully. Table deleted as last player left.',
        tableId,
        tableDeleted: true,
      };
    }

    return {
      message: 'Left table successfully',
      tableId,
      tableDeleted: false,
    };
  }

  async remove(tableId: number) {
    const tableSession = await this.prisma.tableSession.findUnique({
      where: { id: tableId },
      include: {
        games: {
          where: {
            endedAt: null, // Only active games
          },
          include: {
            gamePlayers: true,
          },
        },
      },
    });

    if (!tableSession) {
      throw new NotFoundException('Table', tableId);
    }

    // Check if there are any active games with players
    const hasActivePlayers = tableSession.games.some((game) => game.gamePlayers.length > 0);

    if (hasActivePlayers) {
      throw new ForbiddenException(
        'Cannot delete table with active players. Please wait for all players to leave.',
      );
    }

    // Delete the table session (cascade will handle related games)
    await this.prisma.tableSession.delete({
      where: { id: tableId },
    });

    return {
      message: 'Table removed successfully',
      tableId,
    };
  }

  async forceRemove(tableId: number) {
    const tableSession = await this.prisma.tableSession.findUnique({
      where: { id: tableId },
      include: {
        games: {
          where: {
            endedAt: null, // Only active games
          },
          include: {
            gamePlayers: true,
          },
        },
      },
    });

    if (!tableSession) {
      throw new NotFoundException('Table', tableId);
    }

    // Force remove all players from active games
    let removedCount = 0;
    for (const game of tableSession.games) {
      for (const player of game.gamePlayers) {
        await this.prisma.gamePlayer.delete({
          where: { id: player.id },
        });
        removedCount++;
      }
    }

    // Delete the table session (cascade will handle related games)
    await this.prisma.tableSession.delete({
      where: { id: tableId },
    });

    return {
      message: 'Table force removed successfully',
      tableId,
      playersRemoved: removedCount,
    };
  }
}
