import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.bot.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(userId: number, createBotDto: CreateBotDto) {
    return this.prisma.bot.create({
      data: {
        ...createBotDto,
        userId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
    });

    if (!bot) {
      throw new NotFoundException('Bot', id);
    }

    if (bot.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this bot');
    }

    return {
      id: bot.id,
      name: bot.name,
      code: bot.code,
      description: bot.description,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    };
  }

  async update(id: number, userId: number, updateBotDto: UpdateBotDto) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
    });

    if (!bot) {
      throw new NotFoundException('Bot', id);
    }

    if (bot.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this bot');
    }

    return this.prisma.bot.update({
      where: { id },
      data: updateBotDto,
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
    });

    if (!bot) {
      throw new NotFoundException('Bot', id);
    }

    if (bot.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this bot');
    }

    return this.prisma.bot.delete({
      where: { id },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async testBot(id: number, userId: number, testDto: any) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
    });

    if (!bot) {
      throw new NotFoundException('Bot', id);
    }

    if (bot.userId !== userId) {
      throw new ForbiddenException('You do not have permission to test this bot');
    }

    // Bot testing logic - coming soon
    // This will execute the bot code in a sandboxed environment
    return {
      message: 'Bot testing - coming soon',
      botId: bot.id,
      botName: bot.name,
    };
  }
}
