import { Test, TestingModule } from '@nestjs/testing';
import { BotsService } from './bots.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('BotsService', () => {
  let service: BotsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    bot: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockBot = {
    id: 1,
    userId: 1,
    name: 'Test Bot',
    code: 'function play() { return "pass"; }',
    description: 'A test bot',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all bots for a user', async () => {
      const userId = 1;
      const mockBots = [
        {
          id: 1,
          name: 'Bot 1',
          description: 'Description 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Bot 2',
          description: 'Description 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.bot.findMany.mockResolvedValue(mockBots);

      const result = await service.findAll(userId);

      expect(prismaService.bot.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockBots);
    });

    it('should return empty array if user has no bots', async () => {
      const userId = 1;
      mockPrismaService.bot.findMany.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new bot', async () => {
      const userId = 1;
      const createBotDto: CreateBotDto = {
        name: 'New Bot',
        code: 'function play() { return "pass"; }',
        description: 'A new bot',
      };

      const createdBot = {
        id: 1,
        name: createBotDto.name,
        code: createBotDto.code,
        description: createBotDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.bot.create.mockResolvedValue(createdBot);

      const result = await service.create(userId, createBotDto);

      expect(prismaService.bot.create).toHaveBeenCalledWith({
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
      expect(result).toEqual(createdBot);
    });
  });

  describe('findOne', () => {
    it('should return a bot if user owns it', async () => {
      const botId = 1;
      const userId = 1;

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      const result = await service.findOne(botId, userId);

      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: botId },
      });
      expect(result).toEqual({
        id: mockBot.id,
        name: mockBot.name,
        code: mockBot.code,
        description: mockBot.description,
        createdAt: mockBot.createdAt,
        updatedAt: mockBot.updatedAt,
      });
      expect(result).toHaveProperty('code');
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const botId = 999;
      const userId = 1;

      mockPrismaService.bot.findUnique.mockResolvedValue(null);

      await expect(service.findOne(botId, userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: botId },
      });
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const botId = 1;
      const userId = 2;

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      await expect(service.findOne(botId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a bot if user owns it', async () => {
      const botId = 1;
      const userId = 1;
      const updateBotDto: UpdateBotDto = {
        name: 'Updated Bot',
        code: 'function play() { return "play"; }',
      };

      const updatedBot = {
        id: mockBot.id,
        name: updateBotDto.name,
        code: updateBotDto.code,
        description: mockBot.description,
        createdAt: mockBot.createdAt,
        updatedAt: new Date(),
      };

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.update.mockResolvedValue(updatedBot);

      const result = await service.update(botId, userId, updateBotDto);

      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: botId },
      });
      expect(prismaService.bot.update).toHaveBeenCalledWith({
        where: { id: botId },
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
      expect(result).toEqual(updatedBot);
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const botId = 999;
      const userId = 1;
      const updateBotDto: UpdateBotDto = { name: 'Updated Bot' };

      mockPrismaService.bot.findUnique.mockResolvedValue(null);

      await expect(service.update(botId, userId, updateBotDto)).rejects.toThrow(NotFoundException);
      expect(prismaService.bot.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const botId = 1;
      const userId = 2;
      const updateBotDto: UpdateBotDto = { name: 'Updated Bot' };

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      await expect(service.update(botId, userId, updateBotDto)).rejects.toThrow(ForbiddenException);
      expect(prismaService.bot.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates', async () => {
      const botId = 1;
      const userId = 1;
      const updateBotDto: UpdateBotDto = { name: 'Updated Name Only' };

      const updatedBot = {
        ...mockBot,
        name: updateBotDto.name,
        updatedAt: new Date(),
      };

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.update.mockResolvedValue(updatedBot);

      const result = await service.update(botId, userId, updateBotDto);

      expect(prismaService.bot.update).toHaveBeenCalledWith({
        where: { id: botId },
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
      expect(result.name).toBe(updateBotDto.name);
    });
  });

  describe('remove', () => {
    it('should delete a bot if user owns it', async () => {
      const botId = 1;
      const userId = 1;

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.delete.mockResolvedValue(mockBot);

      const result = await service.remove(botId, userId);

      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: botId },
      });
      expect(prismaService.bot.delete).toHaveBeenCalledWith({
        where: { id: botId },
      });
      expect(result).toEqual(mockBot);
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const botId = 999;
      const userId = 1;

      mockPrismaService.bot.findUnique.mockResolvedValue(null);

      await expect(service.remove(botId, userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.bot.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const botId = 1;
      const userId = 2;

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      await expect(service.remove(botId, userId)).rejects.toThrow(ForbiddenException);
      expect(prismaService.bot.delete).not.toHaveBeenCalled();
    });
  });

  describe('testBot', () => {
    it('should return test result if user owns the bot', async () => {
      const botId = 1;
      const userId = 1;
      const testDto = { scenario: 'test' };

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      const result = await service.testBot(botId, userId, testDto);

      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: botId },
      });
      expect(result).toEqual({
        message: 'Bot testing - coming soon',
        botId: mockBot.id,
        botName: mockBot.name,
      });
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const botId = 999;
      const userId = 1;
      const testDto = { scenario: 'test' };

      mockPrismaService.bot.findUnique.mockResolvedValue(null);

      await expect(service.testBot(botId, userId, testDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const botId = 1;
      const userId = 2;
      const testDto = { scenario: 'test' };

      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      await expect(service.testBot(botId, userId, testDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
