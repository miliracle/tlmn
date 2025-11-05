import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto } from './dto/create-bot.dto';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.bot.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: number, createBotDto: CreateBotDto) {
    return this.prisma.bot.create({
      data: {
        ...createBotDto,
        userId,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.bot.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBotDto: Partial<CreateBotDto>) {
    return this.prisma.bot.update({
      where: { id },
      data: updateBotDto,
    });
  }

  async remove(id: number) {
    return this.prisma.bot.delete({
      where: { id },
    });
  }

  async testBot(id: number, testDto: any) {
    // Bot testing logic - coming soon
    return { message: 'Bot testing - coming soon' };
  }
}

