import { Test, TestingModule } from '@nestjs/testing';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('BotsController', () => {
  let controller: BotsController;
  let botsService: BotsService;

  const mockBotsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    testBot: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockBot = {
    id: 1,
    userId: 1,
    name: 'Test Bot',
    code: 'function play() { return "pass"; }',
    description: 'A test bot',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotsController],
      providers: [
        {
          provide: BotsService,
          useValue: mockBotsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<BotsController>(BotsController);
    botsService = module.get<BotsService>(BotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all bots for the authenticated user', async () => {
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

      mockBotsService.findAll.mockResolvedValue(mockBots);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(botsService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockBots);
    });

    it('should return empty array if user has no bots', async () => {
      mockBotsService.findAll.mockResolvedValue([]);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(botsService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new bot', async () => {
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

      mockBotsService.create.mockResolvedValue(createdBot);

      const mockRequest = { user: mockUser };
      const result = await controller.create(mockRequest, createBotDto);

      expect(botsService.create).toHaveBeenCalledWith(mockUser.id, createBotDto);
      expect(result).toEqual(createdBot);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('code');
    });
  });

  describe('findOne', () => {
    it('should return a bot by id', async () => {
      const botResponse = {
        id: mockBot.id,
        name: mockBot.name,
        code: mockBot.code,
        description: mockBot.description,
        createdAt: mockBot.createdAt,
        updatedAt: mockBot.updatedAt,
      };

      mockBotsService.findOne.mockResolvedValue(botResponse);

      const mockRequest = { user: mockUser };
      const result = await controller.findOne(mockRequest, '1');

      expect(botsService.findOne).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(botResponse);
      expect(result).toHaveProperty('code');
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const error = new NotFoundException('Bot', 999);
      mockBotsService.findOne.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.findOne(mockRequest, '999')).rejects.toThrow(NotFoundException);
      expect(botsService.findOne).toHaveBeenCalledWith(999, mockUser.id);
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const error = new ForbiddenException('You do not have permission to access this bot');
      mockBotsService.findOne.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.findOne(mockRequest, '2')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a bot', async () => {
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

      mockBotsService.update.mockResolvedValue(updatedBot);

      const mockRequest = { user: mockUser };
      const result = await controller.update(mockRequest, '1', updateBotDto);

      expect(botsService.update).toHaveBeenCalledWith(1, mockUser.id, updateBotDto);
      expect(result).toEqual(updatedBot);
      expect(result.name).toBe(updateBotDto.name);
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const updateBotDto: UpdateBotDto = { name: 'Updated Bot' };
      const error = new NotFoundException('Bot', 999);
      mockBotsService.update.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.update(mockRequest, '999', updateBotDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const updateBotDto: UpdateBotDto = { name: 'Updated Bot' };
      const error = new ForbiddenException('You do not have permission to update this bot');
      mockBotsService.update.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.update(mockRequest, '2', updateBotDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a bot', async () => {
      mockBotsService.remove.mockResolvedValue(mockBot);

      const mockRequest = { user: mockUser };
      const result = await controller.remove(mockRequest, '1');

      expect(botsService.remove).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(mockBot);
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const error = new NotFoundException('Bot', 999);
      mockBotsService.remove.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.remove(mockRequest, '999')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const error = new ForbiddenException('You do not have permission to delete this bot');
      mockBotsService.remove.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.remove(mockRequest, '2')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('testBot', () => {
    it('should test a bot', async () => {
      const testDto = { scenario: 'test' };
      const testResult = {
        message: 'Bot testing - coming soon',
        botId: mockBot.id,
        botName: mockBot.name,
      };

      mockBotsService.testBot.mockResolvedValue(testResult);

      const mockRequest = { user: mockUser };
      const result = await controller.testBot(mockRequest, '1', testDto);

      expect(botsService.testBot).toHaveBeenCalledWith(1, mockUser.id, testDto);
      expect(result).toEqual(testResult);
      expect(result).toHaveProperty('botId');
      expect(result).toHaveProperty('botName');
    });

    it('should throw NotFoundException if bot does not exist', async () => {
      const testDto = { scenario: 'test' };
      const error = new NotFoundException('Bot', 999);
      mockBotsService.testBot.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.testBot(mockRequest, '999', testDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own the bot', async () => {
      const testDto = { scenario: 'test' };
      const error = new ForbiddenException('You do not have permission to test this bot');
      mockBotsService.testBot.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.testBot(mockRequest, '2', testDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
