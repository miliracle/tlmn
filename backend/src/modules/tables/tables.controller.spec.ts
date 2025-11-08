import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { NotFoundException, ForbiddenException } from '../../common/exceptions';

describe('TablesController', () => {
  let controller: TablesController;
  let tablesService: TablesService;

  const mockTablesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    remove: jest.fn(),
    forceRemove: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockTableSession = {
    id: 1,
    config: { playerCount: 4, gameCount: 1 },
    status: 'Waiting',
    createdAt: new Date(),
    updatedAt: new Date(),
    games: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: mockTablesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TablesController>(TablesController);
    tablesService = module.get<TablesService>(TablesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new table', async () => {
      const createTableDto: CreateTableDto = {
        config: { playerCount: 4, gameCount: 1 },
      };

      mockTablesService.create.mockResolvedValue(mockTableSession);

      const mockRequest = { user: mockUser };
      const result = await controller.create(mockRequest, createTableDto);

      expect(tablesService.create).toHaveBeenCalledWith(mockUser.id, createTableDto);
      expect(result).toEqual(mockTableSession);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('Waiting');
    });

    it('should create table with default config if not provided', async () => {
      const createTableDto: CreateTableDto = {};

      mockTablesService.create.mockResolvedValue(mockTableSession);

      const mockRequest = { user: mockUser };
      const result = await controller.create(mockRequest, createTableDto);

      expect(tablesService.create).toHaveBeenCalledWith(mockUser.id, createTableDto);
      expect(result).toEqual(mockTableSession);
    });
  });

  describe('findAll', () => {
    it('should return all tables', async () => {
      const mockTables = [mockTableSession, { ...mockTableSession, id: 2 }];

      mockTablesService.findAll.mockResolvedValue(mockTables);

      const result = await controller.findAll();

      expect(tablesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTables);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no tables exist', async () => {
      mockTablesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(tablesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a table by id', async () => {
      mockTablesService.findOne.mockResolvedValue(mockTableSession);

      const result = await controller.findOne('1');

      expect(tablesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTableSession);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('config');
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const error = new NotFoundException('Table', 999);
      mockTablesService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(tablesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('join', () => {
    it('should join a table successfully', async () => {
      const joinResult = {
        message: 'Joined table successfully',
        tableId: 1,
        gameId: 1,
        position: 0,
      };

      mockTablesService.join.mockResolvedValue(joinResult);

      const mockRequest = { user: mockUser };
      const result = await controller.join(mockRequest, '1');

      expect(tablesService.join).toHaveBeenCalledWith(mockUser.id, 1);
      expect(result).toEqual(joinResult);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('tableId');
    });

    it('should handle already joined table', async () => {
      const joinResult = {
        message: 'Already joined this table',
        tableId: 1,
        gameId: 1,
      };

      mockTablesService.join.mockResolvedValue(joinResult);

      const mockRequest = { user: mockUser };
      const result = await controller.join(mockRequest, '1');

      expect(result.message).toBe('Already joined this table');
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const error = new NotFoundException('Table', 999);
      mockTablesService.join.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.join(mockRequest, '999')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if table is completed', async () => {
      const error = new ForbiddenException('Cannot join a completed table session');
      mockTablesService.join.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.join(mockRequest, '1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if table is full', async () => {
      const error = new ForbiddenException('Table is full');
      mockTablesService.join.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.join(mockRequest, '1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('leave', () => {
    it('should leave a table successfully', async () => {
      const leaveResult = {
        message: 'Left table successfully',
        tableId: 1,
      };

      mockTablesService.leave.mockResolvedValue(leaveResult);

      const mockRequest = { user: mockUser };
      const result = await controller.leave(mockRequest, '1');

      expect(tablesService.leave).toHaveBeenCalledWith(mockUser.id, 1);
      expect(result).toEqual(leaveResult);
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Left table successfully');
    });

    it('should handle case when user is not in table', async () => {
      const leaveResult = {
        message: 'Not currently in this table',
        tableId: 1,
      };

      mockTablesService.leave.mockResolvedValue(leaveResult);

      const mockRequest = { user: mockUser };
      const result = await controller.leave(mockRequest, '1');

      expect(result.message).toBe('Not currently in this table');
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const error = new NotFoundException('Table', 999);
      mockTablesService.leave.mockRejectedValue(error);

      const mockRequest = { user: mockUser };

      await expect(controller.leave(mockRequest, '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a table when empty', async () => {
      const removeResult = {
        message: 'Table removed successfully',
        tableId: 1,
      };

      mockTablesService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove('1');

      expect(tablesService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removeResult);
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Table removed successfully');
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const error = new NotFoundException('Table', 999);
      mockTablesService.remove.mockRejectedValue(error);

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if table has active players', async () => {
      const error = new ForbiddenException(
        'Cannot delete table with active players. Please wait for all players to leave.',
      );
      mockTablesService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('forceRemove', () => {
    it('should force remove a table and all players (admin only)', async () => {
      const forceRemoveResult = {
        message: 'Table force removed successfully',
        tableId: 1,
        playersRemoved: 3,
      };

      mockTablesService.forceRemove.mockResolvedValue(forceRemoveResult);

      const mockRequest = { user: { ...mockUser, role: 'admin' } };
      const result = await controller.forceRemove(mockRequest, '1');

      expect(tablesService.forceRemove).toHaveBeenCalledWith(1);
      expect(result).toEqual(forceRemoveResult);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('playersRemoved');
      expect(result.playersRemoved).toBe(3);
    });

    it('should throw NotFoundException if table does not exist', async () => {
      const error = new NotFoundException('Table', 999);
      mockTablesService.forceRemove.mockRejectedValue(error);

      const mockRequest = { user: { ...mockUser, role: 'admin' } };

      await expect(controller.forceRemove(mockRequest, '999')).rejects.toThrow(NotFoundException);
    });
  });
});
