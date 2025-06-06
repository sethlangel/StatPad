import { ErrorService } from '../error-service.js';

describe('ErrorService', () => {
  let errorService;
  let mockSupabase;
  let mockSupabaseAdmin;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
            gte: jest.fn(),
            order: jest.fn()
          }))
        }))
      }))
    };

    mockSupabaseAdmin = {
      from: jest.fn(() => ({
        insert: jest.fn()
      }))
    };

    errorService = new ErrorService(mockSupabase, mockSupabaseAdmin);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logError', () => {
    it('should successfully log an error with valid parameters', async () => {
      const userId = 'user-123';
      const gameId = 'game-456';
      const errorType = 'SERVE';
      const mockErrorTypeData = { id: 'error-789' };

      // Mock validateErrorType
      const mockSelectChain = {
        single: jest.fn().mockResolvedValue({
          data: mockErrorTypeData,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockReturnValue(mockSelectChain)
        }))
      });

      // Mock insert operation
      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: null
        })
      });

      const result = await errorService.logError(userId, gameId, errorType);

      expect(result).toEqual({ message: "Error logged successfully" });
      expect(mockSupabaseAdmin.from().insert).toHaveBeenCalledWith({
        game_id: gameId,
        error_id: mockErrorTypeData.id,
        user_id: userId
      });
    });

    it('should throw error when userId is missing', async () => {
      await expect(errorService.logError(null, 'game-123', 'SERVE'))
        .rejects.toThrow('User ID, Game ID, and Error Type are required');
    });

    it('should throw error when gameId is missing', async () => {
      await expect(errorService.logError('user-123', null, 'SERVE'))
        .rejects.toThrow('User ID, Game ID, and Error Type are required');
    });

    it('should throw error when errorType is missing', async () => {
      await expect(errorService.logError('user-123', 'game-456', null))
        .rejects.toThrow('User ID, Game ID, and Error Type are required');
    });

    it('should throw error when error type validation fails', async () => {
      const userId = 'user-123';
      const gameId = 'game-456';
      const errorType = 'INVALID_ERROR';

      const mockSelectChain = {
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No rows returned' }
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockReturnValue(mockSelectChain)
        }))
      });

      await expect(errorService.logError(userId, gameId, errorType))
        .rejects.toThrow('Invalid error type');
    });

    it('should throw error when database insert fails', async () => {
      const userId = 'user-123';
      const gameId = 'game-456';
      const errorType = 'SERVE';
      const mockErrorTypeData = { id: 'error-789' };

      // Mock successful validateErrorType
      const mockSelectChain = {
        single: jest.fn().mockResolvedValue({
          data: mockErrorTypeData,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockReturnValue(mockSelectChain)
        }))
      });

      // Mock failed insert operation
      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: { message: 'Insert failed' }
        })
      });

      await expect(errorService.logError(userId, gameId, errorType))
        .rejects.toThrow('Insert failed');
    });
  });

  describe('validateErrorType', () => {
    it('should return error type data for valid error type', async () => {
      const errorType = 'SERVE';
      const mockErrorTypeData = { id: 'error-123' };

      const mockSelectChain = {
        single: jest.fn().mockResolvedValue({
          data: mockErrorTypeData,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockReturnValue(mockSelectChain)
        }))
      });

      const result = await errorService.validateErrorType(errorType);

      expect(result).toEqual(mockErrorTypeData);
      expect(mockSupabase.from).toHaveBeenCalledWith('error_list');
    });

    it('should throw error when errorType is missing', async () => {
      await expect(errorService.validateErrorType(null))
        .rejects.toThrow('Error type is required');
    });

    it('should throw error when error type does not exist', async () => {
      const errorType = 'INVALID_ERROR';

      const mockSelectChain = {
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No rows returned' }
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockReturnValue(mockSelectChain)
        }))
      });

      await expect(errorService.validateErrorType(errorType))
        .rejects.toThrow('Invalid error type');
    });
  });

  describe('getTodayErrorCount', () => {
    it('should return error count for valid user', async () => {
      const userId = 'user-123';
      const mockCount = 5;

      const mockSelectChain = {
        eq: jest.fn(() => ({
          gte: jest.fn().mockResolvedValue({
            count: mockCount,
            error: null
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await errorService.getTodayErrorCount(userId);

      expect(result).toEqual({ errors: mockCount });
    });

    it('should return zero when count is null', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          gte: jest.fn().mockResolvedValue({
            count: null,
            error: null
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await errorService.getTodayErrorCount(userId);

      expect(result).toEqual({ errors: 0 });
    });

    it('should throw error when userId is missing', async () => {
      await expect(errorService.getTodayErrorCount(null))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error when database operation fails', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          gte: jest.fn().mockResolvedValue({
            count: null,
            error: { message: 'Database error' }
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      await expect(errorService.getTodayErrorCount(userId))
        .rejects.toThrow('Database error');
    });
  });

  describe('getUserErrorTrajectory', () => {
    it('should return formatted trajectory data for valid user', async () => {
      const userId = 'user-123';
      const mockErrorData = [
        { created_at: '2024-01-01T10:00:00Z' },
        { created_at: '2024-01-01T11:00:00Z' },
        { created_at: '2024-01-02T10:00:00Z' }
      ];

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({
            data: mockErrorData,
            error: null
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await errorService.getUserErrorTrajectory(userId);

      expect(result).toHaveLength(2); // Two unique dates
      expect(result).toContainEqual({ date: '1/1/2024', count: 2 });
      expect(result).toContainEqual({ date: '1/2/2024', count: 1 });
    });

    it('should return empty array when user has no errors', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      const result = await errorService.getUserErrorTrajectory(userId);

      expect(result).toEqual([]);
    });

    it('should throw error when userId is missing', async () => {
      await expect(errorService.getUserErrorTrajectory(null))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error when database operation fails', async () => {
      const userId = 'user-123';

      const mockSelectChain = {
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectChain)
      });

      await expect(errorService.getUserErrorTrajectory(userId))
        .rejects.toThrow('Database error');
    });
  });
});
