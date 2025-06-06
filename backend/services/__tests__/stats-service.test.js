import { StatsService } from '../stats-service.js';

describe('StatsService', () => {
  let statsService;
  let mockSupabase;
  let mockSupabaseAdmin;

  beforeEach(() => {
    mockSupabase = {
      rpc: jest.fn()
    };

    mockSupabaseAdmin = {
      rpc: jest.fn()
    };

    statsService = new StatsService(mockSupabase, mockSupabaseAdmin);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserStats', () => {
    it('should return user stats for valid parameters', async () => {
      const userId = 'user-123';
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockStatsData = [
        { error_name: 'SERVE', total_error_count: 10, error_rank: 1 },
        { error_name: 'VOLLEY', total_error_count: 5, error_rank: 2 }
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockStatsData,
        error: null
      });

      const result = await statsService.getUserStats(userId, startDate, endDate);

      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_stats', {
        p_end_date: endDate,
        p_start_date: startDate,
        p_user_id: userId
      });
      expect(result).toEqual(mockStatsData);
    });

    it('should throw error when userId is missing', async () => {
      await expect(statsService.getUserStats(null, '2024-01-01', '2024-01-31'))
        .rejects.toThrow('User ID, start date, and end date are required');
    });

    it('should throw error when startDate is missing', async () => {
      await expect(statsService.getUserStats('user-123', null, '2024-01-31'))
        .rejects.toThrow('User ID, start date, and end date are required');
    });

    it('should throw error when endDate is missing', async () => {
      await expect(statsService.getUserStats('user-123', '2024-01-01', null))
        .rejects.toThrow('User ID, start date, and end date are required');
    });

    it('should throw error when RPC call fails', async () => {
      const userId = 'user-123';
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'RPC function failed' }
      });

      await expect(statsService.getUserStats(userId, startDate, endDate))
        .rejects.toThrow('Error fetching user stats: RPC function failed');
    });
  });

  describe('getUserWeekStats', () => {
    it('should return user week stats for valid userId', async () => {
      const userId = 'user-123';
      const mockWeekStatsData = {
        game_count: 5,
        error_count: 15,
        total_time_ms: 3600000
      };

      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: mockWeekStatsData,
        error: null
      });

      const result = await statsService.getUserWeekStats(userId);

      expect(mockSupabaseAdmin.rpc).toHaveBeenCalledWith('get_user_week_stats', {
        user_uuid: userId
      });
      expect(result).toEqual({
        game_count: 5,
        error_count: 15,
        total_time: 3600000,
        total_time_unit: "ms"
      });
    });

    it('should throw error when userId is missing', async () => {
      await expect(statsService.getUserWeekStats(null))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error when RPC call fails', async () => {
      const userId = 'user-123';

      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Week stats RPC failed' }
      });

      await expect(statsService.getUserWeekStats(userId))
        .rejects.toThrow('Error fetching week stats: Week stats RPC failed');
    });
  });

  describe('getAverageUserWeekStats', () => {
    it('should return average user week stats', async () => {
      const mockAverageStatsData = {
        total_matches_played: 100,
        total_errors_made: 250,
        total_time_played_ms: 72000000,
        errors_per_game: 2.5
      };

      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: mockAverageStatsData,
        error: null
      });

      const result = await statsService.getAverageUserWeekStats();

      expect(mockSupabaseAdmin.rpc).toHaveBeenCalledWith('get_average_user_week_stats');
      expect(result).toEqual({
        total_matches_played: 100,
        total_errors_made: 250,
        total_time: 72000000,
        total_time_unit: "ms",
        errors_per_game: 2.5
      });
    });

    it('should throw error when RPC call fails', async () => {
      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Average stats RPC failed' }
      });

      await expect(statsService.getAverageUserWeekStats())
        .rejects.toThrow('Error fetching average stats: Average stats RPC failed');
    });
  });

  describe('getUserRankings', () => {
    it('should return user rankings', async () => {
      const mockRankingsData = [
        { name: 'John Doe', error_count: 10, id: 'user-123' },
        { name: 'Jane Smith', error_count: 15, id: 'user-456' }
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockRankingsData,
        error: null
      });

      const result = await statsService.getUserRankings();

      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_rankings');
      expect(result).toEqual(mockRankingsData);
    });

    it('should throw error when RPC call fails', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Rankings RPC failed' }
      });

      await expect(statsService.getUserRankings())
        .rejects.toThrow('Error fetching user rankings: Rankings RPC failed');
    });
  });
});
