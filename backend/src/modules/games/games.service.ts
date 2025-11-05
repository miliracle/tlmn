import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      include: {
        gamePlayers: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.game.findUnique({
      where: { id },
      include: {
        gamePlayers: true,
      },
    });
  }

  async getSession(id: number) {
    return this.prisma.tableSession.findUnique({
      where: { id },
      include: {
        games: {
          include: {
            gamePlayers: true,
          },
        },
      },
    });
  }
}

