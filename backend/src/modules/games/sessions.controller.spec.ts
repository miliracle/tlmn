import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('SessionsController', () => {
  let controller: SessionsController;
  let gamesService: GamesService;

  const mockGamesService = {
    getSession: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockSession = {
    id: 1,
    config: { playerCount: 4, gameCount: 1 },
    status: 'Completed',
    startedAt: new Date(),
    endedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    games: [
      {
        id: 1,
        tableId: 'table-123',
        winnerId: 1,
        scores: { 1: 100 },
        totalRounds: 5,
        startedAt: new Date(),
        endedAt: new Date(),
        gamePlayers: [
          {
            userId: 1,
            position: 0,
            finalScore: 100,
            user: { id: 1, username: 'testuser' },
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
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

    controller = module.get<SessionsController>(SessionsController);
    gamesService = module.get<GamesService>(GamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSession', () => {
    it('should return a session by id if user participated', async () => {
      mockGamesService.getSession.mockResolvedValue(mockSession);

      const mockRequest = { user: mockUser };
      const result = await controller.getSession(mockRequest, '1');

      expect(gamesService.getSession).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(mockSession);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('config');
      expect(result).toHaveProperty('games');
      expect(result.games).toHaveLength(1);
    });

    it('should throw NotFoundException if session does not exist', async () => {
      const error = new NotFoundException('Session', 999);
      mockGamesService.getSession.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.getSession(mockRequest, '999')).rejects.toThrow(NotFoundException);
      expect(gamesService.getSession).toHaveBeenCalledWith(999, mockUser.id);
    });

    it('should throw ForbiddenException if user did not participate', async () => {
      const error = new ForbiddenException('You do not have permission to view this session');
      mockGamesService.getSession.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.getSession(mockRequest, '2')).rejects.toThrow(ForbiddenException);
    });

    it('should return session with all games and players', async () => {
      const sessionWithMultipleGames = {
        ...mockSession,
        games: [
          mockSession.games[0],
          {
            ...mockSession.games[0],
            id: 2,
            gamePlayers: [
              {
                userId: 2,
                position: 0,
                finalScore: 50,
                user: { id: 2, username: 'user2' },
              },
            ],
          },
        ],
      };

      mockGamesService.getSession.mockResolvedValue(sessionWithMultipleGames);

      const mockRequest = { user: mockUser };
      const result = await controller.getSession(mockRequest, '1');

      expect(result.games).toHaveLength(2);
      expect(result.games[0]).toHaveProperty('gamePlayers');
      expect(result.games[1]).toHaveProperty('gamePlayers');
    });
  });
});
