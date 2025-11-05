import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTableDto: any) {
    // Table creation logic - coming soon
    return { message: 'Table creation - coming soon' };
  }

  async findOne(id: string) {
    return { message: 'Get table - coming soon' };
  }

  async join(userId: number, tableId: string) {
    return { message: 'Join table - coming soon' };
  }

  async leave(userId: number, tableId: string) {
    return { message: 'Leave table - coming soon' };
  }
}

