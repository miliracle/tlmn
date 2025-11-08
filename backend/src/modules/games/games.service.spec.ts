import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('GamesService', () => {
  let service: GamesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    game: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    tableSession: {
      findUnique: jest.fn(),
    },
  };

  const mockGame = {
    id: 1,
    tableId: 'table-123',
    winnerId: 1,
    scores: { 1: 100, 2: 50 },
    totalRounds: 5,
    startedAt: new Date('2024-01-01'),
    endedAt: new Date('2024-01-01'),
    sessionId: 1,
    gamePlayers: [
      {
        userId: 1,
        position: 0,
        finalScore: 100,
        user: { id: 1, username: 'testuser' },
      },
      {
        userId: 2,
        position: 1,
        finalScore: 50,
        user: { id: 2, username: 'user2' },
      },
    ],
  };

  const mockSession = {
    id: 1,
    config: { playerCount: 4, gameCount: 1 },
    status: 'Completed',
    startedAt: new Date('2024-01-01'),
    endedAt: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    games: [mockGame],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all games for a user', async () => {
      const userId = 1;
      const mockGames = [mockGame, { ...mockGame, id: 2 }];

      mockPrismaService.game.findMany.mockResolvedValue(mockGames);

      const result = await service.findAll(userId);

      expect(prismaService.game.findMany).toHaveBeenCalledWith({
        where: {
          gamePlayers: {
            some: {
              userId,
            },
          },
        },
        select: expect.any(Object),
        orderBy: {
          startedAt: 'desc',
        },
      });
      expect(result).toEqual(mockGames);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no games', async () => {
      const userId = 1;

      mockPrismaService.game.findMany.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
    });

    it('should include game players with user info', async () => {
      const userId = 1;

      mockPrismaService.game.findMany.mockResolvedValue([mockGame]);

      const result = await service.findAll(userId);

      expect(result[0].gamePlayers).toBeDefined();
      expect(result[0].gamePlayers[0]).toHaveProperty('user');
      expect(result[0].gamePlayers[0].user).toHaveProperty('username');
    });
  });

  describe('findOne', () => {
    it('should return a game if user participated', async () => {
      const gameId = 1;
      const userId = 1;

      const gameWithSession = {
        ...mockGame,
        gameLog: { moves: [] },
        session: {
          id: 1,
          config: { playerCount: 4 },
          status: 'Completed',
        },
      };

      mockPrismaService.game.findUnique.mockResolvedValue(gameWithSession);

      const result = await service.findOne(gameId, userId);

      expect(prismaService.game.findUnique).toHaveBeenCalledWith({
        where: { id: gameId },
        select: expect.any(Object),
      });
      expect(result).toEqual(gameWithSession);
      expect(result).toHaveProperty('gameLog');
      expect(result).toHaveProperty('session');
    });

    it('should throw NotFoundException if game does not exist', async () => {
      const gameId = 999;
      const userId = 1;

      mockPrismaService.game.findUnique.mockResolvedValue(null);

      await expect(service.findOne(gameId, userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.game.findUnique).toHaveBeenCalledWith({
        where: { id: gameId },
        select: expect.any(Object),
      });
    });

    it('should throw ForbiddenException if user did not participate', async () => {
      const gameId = 1;
      const userId = 999; // Different user

      mockPrismaService.game.findUnique.mockResolvedValue(mockGame);

      await expect(service.findOne(gameId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should include session information', async () => {
      const gameId = 1;
      const userId = 1;

      const gameWithSession = {
        ...mockGame,
        session: {
          id: 1,
          config: { playerCount: 4 },
          status: 'Completed',
        },
      };

      mockPrismaService.game.findUnique.mockResolvedValue(gameWithSession);

      const result = await service.findOne(gameId, userId);

      expect(result.session).toBeDefined();
      expect(result.session).toHaveProperty('id');
      expect(result.session).toHaveProperty('config');
    });
  });

  describe('getSession', () => {
    it('should return a session if user participated in any game', async () => {
      const sessionId = 1;
      const userId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSession(sessionId, userId);

      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockSession);
      expect(result).toHaveProperty('games');
      expect(result.games).toHaveLength(1);
    });

    it('should throw NotFoundException if session does not exist', async () => {
      const sessionId = 999;
      const userId = 1;

      mockPrismaService.tableSession.findUnique.mockResolvedValue(null);

      await expect(service.getSession(sessionId, userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.tableSession.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        select: expect.any(Object),
      });
    });

    it('should throw ForbiddenException if user did not participate', async () => {
      const sessionId = 1;
      const userId = 999; // Different user

      mockPrismaService.tableSession.findUnique.mockResolvedValue(mockSession);

      await expect(service.getSession(sessionId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should return session with all games ordered by start time', async () => {
      const sessionId = 1;
      const userId = 1;

      const sessionWithMultipleGames = {
        ...mockSession,
        games: [
          mockGame,
          { ...mockGame, id: 2, startedAt: new Date('2024-01-02') },
          { ...mockGame, id: 3, startedAt: new Date('2024-01-03') },
        ],
      };

      mockPrismaService.tableSession.findUnique.mockResolvedValue(sessionWithMultipleGames);

      const result = await service.getSession(sessionId, userId);

      expect(result.games).toHaveLength(3);
      expect(result.games[0].id).toBe(1);
      expect(result.games[2].id).toBe(3);
    });

    it('should check participation across all games in session', async () => {
      const sessionId = 1;
      const userId = 1;

      const sessionWithUserInSecondGame = {
        ...mockSession,
        games: [
          { ...mockGame, id: 1, gamePlayers: [{ userId: 2, position: 0 }] },
          { ...mockGame, id: 2, gamePlayers: [{ userId: 1, position: 0 }] },
        ],
      };

      mockPrismaService.tableSession.findUnique.mockResolvedValue(sessionWithUserInSecondGame);

      const result = await service.getSession(sessionId, userId);

      expect(result).toBeDefined();
      expect(result.games).toHaveLength(2);
    });

    it('should throw ForbiddenException if user not in any game', async () => {
      const sessionId = 1;
      const userId = 999;

      const sessionWithoutUser = {
        ...mockSession,
        games: [
          { ...mockGame, gamePlayers: [{ userId: 2, position: 0 }] },
          { ...mockGame, id: 2, gamePlayers: [{ userId: 3, position: 0 }] },
        ],
      };

      mockPrismaService.tableSession.findUnique.mockResolvedValue(sessionWithoutUser);

      await expect(service.getSession(sessionId, userId)).rejects.toThrow(ForbiddenException);
    });
  });
});
