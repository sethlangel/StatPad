import { GameService } from '../game-service.js';

describe('GameService', () => {
  let gameService;
  let mockSupabase;
  let mockSupabaseAdmin;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    };

    mockSupabaseAdmin = {
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn()
        })),
        update: jest.fn(() => ({
          eq: jest.fn()
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn()
            }))
          }))
        }))
      }))
    };

    gameService = new GameService(mockSupabase, mockSupabaseAdmin);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should successfully create a game for valid user', async () => {
      const userId = 'user-123';
      const mockGameData = [{ id: 'game-456' }];

      const mockInsertChain = {
        select: jest.fn().mockResolvedValue({
          data: mockGameData,
          error: null
        })
      };

      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockInsertChain)
      });

      const result = await gameService.createGame(userId);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('games');
      expect(result).toEqual({
        message: "Game started",
        gameId: 'game-456'
      });
    });

    it('should throw error when userId is missing', async () => {
      await expect(gameService.createGame(null))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error when database operation fails', async () => {
      const userId = 'user-123';

      const mockInsertChain = {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      };

      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockInsertChain)
      });

      await expect(gameService.createGame(userId))
        .rejects.toThrow('Database error');
    });
  });

  describe('finishGame', () => {
    it('should successfully finish a game', async () => {
      const gameId = 'game-123';

      const mockUpdateChain = {
        eq: jest.fn().mockResolvedValue({
          error: null
        })
      };

      mockSupabaseAdmin.from.mockReturnValue({
        update: jest.fn().mockReturnValue(mockUpdateChain)
      });

      const result = await gameService.finishGame(gameId);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('games');
      expect(result).toEqual({
        message: "Game finished successfully"
      });
    });

    it('should throw error when gameId is missing', async () => {
      await expect(gameService.finishGame(null))
        .rejects.toThrow('Game ID is required');
    });

    it('should throw error when database operation fails', async () => {
      const gameId = 'game-123';

      const mockUpdateChain = {
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Game not found' }
        })
      };

      mockSupabaseAdmin.from.mockReturnValue({
        update: jest.fn().mockReturnValue(mockUpdateChain)
      });

      await expect(gameService.finishGame(gameId))
        .rejects.toThrow('Game not found');
    });
  });

  describe('getCurrentGame', () => {
    it('should return current game ID when user has active game', async () => {
      const userId = 'user-123';
      const mockGameData = [{ id: 'game-456', finished_at: null }];

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: mockGameData,
              error: null
            })
          }))
        }))
      };

      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await gameService.getCurrentGame(userId);

      expect(result).toEqual({ id: 'game-456' });
    });

    it('should return -1 when user has no active game', async () => {
      const userId = 'user-123';
      const mockGameData = [{ id: 'game-456', finished_at: '2024-01-01T00:00:00Z' }];

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: mockGameData,
              error: null
            })
          }))
        }))
      };

      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await gameService.getCurrentGame(userId);

      expect(result).toEqual({ id: -1 });
    });

    it('should return -1 when user has no games', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [],
              error: null
            })
          }))
        }))
      };

      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await gameService.getCurrentGame(userId);

      expect(result).toEqual({ id: -1 });
    });

    it('should throw error when userId is missing', async () => {
      await expect(gameService.getCurrentGame(null))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error when database operation fails', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' }
            })
          }))
        }))
      };

      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      await expect(gameService.getCurrentGame(userId))
        .rejects.toThrow('Database error');
    });
  });

  describe('validateGameExists', () => {
    it('should return game data when game exists and belongs to user', async () => {
      const gameId = 'game-123';
      const userId = 'user-456';
      const mockGameData = { id: 'game-123' };

      const mockSelectChain = {
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockGameData,
              error: null
            })
          }))
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await gameService.validateGameExists(gameId, userId);

      expect(result).toEqual(mockGameData);
    });

    it('should throw error when gameId is missing', async () => {
      await expect(gameService.validateGameExists(null, 'user-123'))
        .rejects.toThrow('Game ID and User ID are required');
    });

    it('should throw error when userId is missing', async () => {
      await expect(gameService.validateGameExists('game-123', null))
        .rejects.toThrow('Game ID and User ID are required');
    });

    it('should throw error when game does not exist', async () => {
      const gameId = 'game-123';
      const userId = 'user-456';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'No rows returned' }
            })
          }))
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      await expect(gameService.validateGameExists(gameId, userId))
        .rejects.toThrow('Game not found or unauthorized');
    });
  });
});
