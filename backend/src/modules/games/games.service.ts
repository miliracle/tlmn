import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.game.findMany({
      where: {
        gamePlayers: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        tableId: true,
        winnerId: true,
        scores: true,
        totalRounds: true,
        startedAt: true,
        endedAt: true,
        sessionId: true,
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
    });
  }

  async findOne(id: number, userId: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      select: {
        id: true,
        tableId: true,
        winnerId: true,
        scores: true,
        totalRounds: true,
        gameLog: true,
        startedAt: true,
        endedAt: true,
        sessionId: true,
        session: {
          select: {
            id: true,
            config: true,
            status: true,
          },
        },
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
    });

    if (!game) {
      throw new NotFoundException('Game', id);
    }

    // Check if user participated in this game
    const userParticipated = game.gamePlayers.some((gp) => gp.userId === userId);

    if (!userParticipated) {
      throw new ForbiddenException('You do not have permission to view this game');
    }

    return game;
  }

  async getSession(id: number, userId: number) {
    const session = await this.prisma.tableSession.findUnique({
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
            winnerId: true,
            scores: true,
            totalRounds: true,
            startedAt: true,
            endedAt: true,
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
            startedAt: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session', id);
    }

    // Check if user participated in any game in this session
    const userParticipated = session.games.some((game) =>
      game.gamePlayers.some((gp) => gp.userId === userId),
    );

    if (!userParticipated) {
      throw new ForbiddenException('You do not have permission to view this session');
    }

    return session;
  }
}
