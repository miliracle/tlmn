import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: GamesService;

  const mockGamesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockGame = {
    id: 1,
    tableId: 'table-123',
    winnerId: 1,
    scores: { 1: 100, 2: 50 },
    totalRounds: 5,
    startedAt: new Date(),
    endedAt: new Date(),
    sessionId: 1,
    gamePlayers: [
      {
        userId: 1,
        position: 0,
        finalScore: 100,
        user: { id: 1, username: 'testuser' },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all games for the authenticated user', async () => {
      const mockGames = [mockGame, { ...mockGame, id: 2 }];

      mockGamesService.findAll.mockResolvedValue(mockGames);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(gamesService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockGames);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no games', async () => {
      mockGamesService.findAll.mockResolvedValue([]);

      const mockRequest = { user: mockUser };
      const result = await controller.findAll(mockRequest);

      expect(gamesService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a game by id if user participated', async () => {
      const gameWithSession = {
        ...mockGame,
        gameLog: { moves: [] },
        session: {
          id: 1,
          config: { playerCount: 4 },
          status: 'Completed',
        },
      };

      mockGamesService.findOne.mockResolvedValue(gameWithSession);

      const mockRequest = { user: mockUser };
      const result = await controller.findOne(mockRequest, '1');

      expect(gamesService.findOne).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(gameWithSession);
      expect(result).toHaveProperty('gameLog');
      expect(result).toHaveProperty('session');
    });

    it('should throw NotFoundException if game does not exist', async () => {
      const error = new NotFoundException('Game', 999);
      mockGamesService.findOne.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.findOne(mockRequest, '999')).rejects.toThrow(
        NotFoundException,
      );
      expect(gamesService.findOne).toHaveBeenCalledWith(999, mockUser.id);
    });

    it('should throw ForbiddenException if user did not participate', async () => {
      const error = new ForbiddenException(
        'You do not have permission to view this game',
      );
      mockGamesService.findOne.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.findOne(mockRequest, '2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

