import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from './tables.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('TablesService', () => {
  let service: TablesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tableSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    gamePlayer: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockTableSession = {
    id: 1,
    config: { playerCount: 4, gameCount: 1 },
    status: 'Waiting',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    games: [],
  };

  const mockGame = {
    id: 1,
    tableId: 'table-123',
    startedAt: new Date(),
    endedAt: null,
    gamePlayers: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new table session', async () => {
      const userId = 1;
      const createTableDto: CreateTableDto = {
        config: { playerCount: 4, gameCount: 1 },
      };

      mockPrismaService.tableSession.create.mockResolvedValue(mockTableSession);

      const result = await service.create(userId, createTableDto);

      expect(prismaService.tableSession.create).toHaveBeenCalledWith({
        data: {
          config: createTableDto.config,
          status: 'Waiting',
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockTableSession);
      expect(result.status).toBe('Waiting');
    });

    it('should create table with default config if not provided', async () => {
      const userId = 1;
      const createTableDto: CreateTableDto = {};

      mockPrismaService.tableSession.create.mockResolvedValue(mockTableSession);

      const result = await service.create(userId, createTableDto);

      expect(prismaService.tableSession.create).toHaveBeenCalledWith({
        data: {
          config: { playerCount: 4, gameCount: 1 },
          status: 'Waiting',
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockTableSession);
    });

    it('should use provided playerCount and gameCount if config not provided', async () => {
      const userId = 1;
      const createTableDto: CreateTableDto = {
        playerCount: 3,
        gameCount: 2,
      };

      mockPrismaService.tableSession.create.mockResolvedValue(mockTableSession);

      await service.create(userId, createTableDto);

      expect(prismaService.tableSession.create).toHaveBeenCalledWith({
        data: {
          config: { playerCount: 3, gameCount: 2 },
          status: 'Waiting',
        },
        select: expect.any(Object),
      });
    });
  });

  describe('findAll', () => {
    it('should return all table sessions', async () => {
      const mockTables = [mockTableSession, { ...mockTableSession, id: 2, status: 'In Progress' }];

      mockPrismaService.tableSession.findMany.mockResolvedValue(mockTables);

      const result = await service.findAll();

      expect(prismaService.tableSession.findMany).toHaveBeenCalledWith({
        select: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockTables);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no tables exist', async () => {
      mockPrismaService.tableSession.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a table session if it exists', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(mockTableSession);

      const result = await service.findOne(tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockTableSession);
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const tableId = 999;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.findOne(tableId)).rejects.toThrow(NotFoundException);
      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
        select: expect.any(Object),
      });
    });
  });

  describe('join', () => {
    it('should join a table session when no active game exists', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [],
      });

      const result = await service.join(userId, tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
        include: expect.any(Object),
      });
      expect(result).toEqual({
        message: 'Joined table session. Waiting for game to start.',
        tableId,
        status: 'Waiting',
      });
    });

    it('should join an active game', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [mockGame],
      });
      mockPrismaService.gamePlayer.create.mockResolvedValue({
        id: 1,
        gameId: 1,
        userId: 1,
        position: 0,
      });

      const result = await service.join(userId, tableId);

      expect(prismaService.gamePlayer.create).toHaveBeenCalledWith({
        data: {
          gameId: mockGame.id,
          userId,
          position: 0,
        },
      });
      expect(result).toEqual({
        message: 'Joined table successfully',
        tableId,
        gameId: mockGame.id,
        position: 0,
      });
    });

    it('should return already joined message if user is already in game', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ userId, position: 0 }],
          },
        ],
      });

      const result = await service.join(userId, tableId);

      expect(prismaService.gamePlayer.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Already joined this table',
        tableId,
        gameId: mockGame.id,
      });
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const userId = 1;
      const tableId = 999;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.join(userId, tableId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if table is completed', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        status: 'Completed',
        games: [],
      });

      await expect(service.join(userId, tableId)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if table is full', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [
              { userId: 2, position: 0 },
              { userId: 3, position: 1 },
              { userId: 4, position: 2 },
              { userId: 5, position: 3 },
            ],
          },
        ],
      });

      await expect(service.join(userId, tableId)).rejects.toThrow(ForbiddenException);
      expect(prismaService.gamePlayer.create).not.toHaveBeenCalled();
    });
  });

  describe('leave', () => {
    it('should remove user from active games', async () => {
      const userId = 1;
      const tableId = 1;

      const tableWithPlayer = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ id: 1, userId, position: 0 }],
          },
        ],
      };

      const tableWithOtherPlayers = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ id: 2, userId: 2, position: 0 }],
          },
        ],
      };

      mockPrismaService.tableSession.findUnique
        .mockResolvedValueOnce(tableWithPlayer)
        .mockResolvedValueOnce(tableWithOtherPlayers);

      mockPrismaService.gamePlayer.delete.mockResolvedValue({
        id: 1,
        gameId: 1,
        userId: 1,
        position: 0,
      });

      const result = await service.leave(userId, tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.tableSession.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: tableId },
        include: {
          games: {
            where: { endedAt: null },
            include: { gamePlayers: true },
          },
        },
      });
      expect(prismaService.tableSession.findUnique).toHaveBeenNthCalledWith(2, {
        where: { id: tableId },
        include: {
          games: {
            where: { endedAt: null },
            include: { gamePlayers: true },
          },
        },
      });
      expect(prismaService.gamePlayer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.tableSession.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Left table successfully',
        tableId,
        tableDeleted: false,
      });
    });

    it('should return message if user is not in table', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [],
          },
        ],
      });

      const result = await service.leave(userId, tableId);

      expect(prismaService.gamePlayer.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Not currently in this table',
        tableId,
      });
    });

    it('should handle table with no active games', async () => {
      const userId = 1;
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [],
      });

      const result = await service.leave(userId, tableId);

      expect(prismaService.gamePlayer.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Not currently in this table',
        tableId,
      });
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const userId = 1;
      const tableId = 999;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.leave(userId, tableId)).rejects.toThrow(NotFoundException);
    });

    it('should remove user from multiple active games if present', async () => {
      const userId = 1;
      const tableId = 1;

      const tableWithPlayer = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            id: 1,
            gamePlayers: [{ id: 1, userId, position: 0 }],
          },
          {
            ...mockGame,
            id: 2,
            gamePlayers: [{ id: 2, userId, position: 0 }],
          },
        ],
      };

      const tableWithOtherPlayers = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            id: 1,
            gamePlayers: [{ id: 3, userId: 2, position: 0 }],
          },
          {
            ...mockGame,
            id: 2,
            gamePlayers: [],
          },
        ],
      };

      mockPrismaService.tableSession.findUnique
        .mockResolvedValueOnce(tableWithPlayer)
        .mockResolvedValueOnce(tableWithOtherPlayers);

      mockPrismaService.gamePlayer.delete
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });

      const result = await service.leave(userId, tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.gamePlayer.delete).toHaveBeenCalledTimes(2);
      expect(prismaService.gamePlayer.delete).toHaveBeenNthCalledWith(1, {
        where: { id: 1 },
      });
      expect(prismaService.gamePlayer.delete).toHaveBeenNthCalledWith(2, {
        where: { id: 2 },
      });
      expect(prismaService.tableSession.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Left table successfully',
        tableId,
        tableDeleted: false,
      });
    });

    it('should delete table when last player leaves', async () => {
      const userId = 1;
      const tableId = 1;

      const tableWithLastPlayer = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ id: 1, userId, position: 0 }],
          },
        ],
      };

      const tableWithNoPlayers = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [],
          },
        ],
      };

      mockPrismaService.tableSession.findUnique
        .mockResolvedValueOnce(tableWithLastPlayer)
        .mockResolvedValueOnce(tableWithNoPlayers);

      mockPrismaService.gamePlayer.delete.mockResolvedValue({
        id: 1,
        gameId: 1,
        userId: 1,
        position: 0,
      });

      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.leave(userId, tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.gamePlayer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.tableSession.delete).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toEqual({
        message: 'Left table successfully. Table deleted as last player left.',
        tableId,
        tableDeleted: true,
      });
    });

    it('should delete table when last player leaves and no active games exist', async () => {
      const userId = 1;
      const tableId = 1;

      const tableWithLastPlayer = {
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ id: 1, userId, position: 0 }],
          },
        ],
      };

      const tableWithNoGames = {
        ...mockTableSession,
        games: [],
      };

      mockPrismaService.tableSession.findUnique
        .mockResolvedValueOnce(tableWithLastPlayer)
        .mockResolvedValueOnce(tableWithNoGames);

      mockPrismaService.gamePlayer.delete.mockResolvedValue({
        id: 1,
        gameId: 1,
        userId: 1,
        position: 0,
      });

      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.leave(userId, tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.gamePlayer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.tableSession.delete).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toEqual({
        message: 'Left table successfully. Table deleted as last player left.',
        tableId,
        tableDeleted: true,
      });
    });
  });

  describe('remove', () => {
    it('should remove a table when no active players', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [],
      });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.remove(tableId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: tableId },
        include: expect.any(Object),
      });
      expect(prismaService.tableSession.delete).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toEqual({
        message: 'Table removed successfully',
        tableId,
      });
    });

    it('should throw ForbiddenException if table has active players', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [{ id: 1, userId: 1, position: 0 }],
          },
        ],
      });

      await expect(service.remove(tableId)).rejects.toThrow(ForbiddenException);
      expect(prismaService.tableSession.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const tableId = 999;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.remove(tableId)).rejects.toThrow(NotFoundException);
      expect(prismaService.tableSession.delete).not.toHaveBeenCalled();
    });

    it('should allow removal when games exist but have no players', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [],
          },
        ],
      });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.remove(tableId);

      expect(prismaService.tableSession.delete).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Table removed successfully',
        tableId,
      });
    });
  });

  describe('forceRemove', () => {
    it('should force remove table and all players', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [
              { id: 1, userId: 1, position: 0 },
              { id: 2, userId: 2, position: 1 },
              { id: 3, userId: 3, position: 2 },
            ],
          },
        ],
      });
      mockPrismaService.gamePlayer.delete
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 })
        .mockResolvedValueOnce({ id: 3 });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.forceRemove(tableId);

      expect(prismaService.gamePlayer.delete).toHaveBeenCalledTimes(3);
      expect(prismaService.tableSession.delete).toHaveBeenCalledWith({
        where: { id: tableId },
      });
      expect(result).toEqual({
        message: 'Table force removed successfully',
        tableId,
        playersRemoved: 3,
      });
    });

    it('should remove table even with no players', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            gamePlayers: [],
          },
        ],
      });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.forceRemove(tableId);

      expect(prismaService.gamePlayer.delete).not.toHaveBeenCalled();
      expect(prismaService.tableSession.delete).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Table force removed successfully',
        tableId,
        playersRemoved: 0,
      });
    });

    it('should handle table with no active games', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [],
      });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.forceRemove(tableId);

      expect(prismaService.gamePlayer.delete).not.toHaveBeenCalled();
      expect(prismaService.tableSession.delete).toHaveBeenCalled();
      expect(result.playersRemoved).toBe(0);
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const tableId = 999;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.forceRemove(tableId)).rejects.toThrow(NotFoundException);
      expect(prismaService.tableSession.delete).not.toHaveBeenCalled();
    });

    it('should remove players from multiple games', async () => {
      const tableId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue({
        ...mockTableSession,
        games: [
          {
            ...mockGame,
            id: 1,
            gamePlayers: [
              { id: 1, userId: 1, position: 0 },
              { id: 2, userId: 2, position: 1 },
            ],
          },
          {
            ...mockGame,
            id: 2,
            gamePlayers: [{ id: 3, userId: 3, position: 0 }],
          },
        ],
      });
      mockPrismaService.gamePlayer.delete
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 })
        .mockResolvedValueOnce({ id: 3 });
      mockPrismaService.tableSession.delete.mockResolvedValue(mockTableSession);

      const result = await service.forceRemove(tableId);

      expect(prismaService.gamePlayer.delete).toHaveBeenCalledTimes(3);
      expect(result.playersRemoved).toBe(3);
    });
  });
});
