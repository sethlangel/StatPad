import { supabase, supabaseAdmin } from "../supabase-client.js";

export class StatsService {
  constructor(supabaseClient = supabase, supabaseAdminClient = supabaseAdmin) {
    this.supabase = supabaseClient;
    this.supabaseAdmin = supabaseAdminClient;
  }

  async getUserStats(userId, startDate, endDate) {
    if (!userId || !startDate || !endDate) {
      throw new Error("User ID, start date, and end date are required");
    }

    const { data, error } = await this.supabase.rpc('get_user_stats', {
      p_end_date: endDate,
      p_start_date: startDate,
      p_user_id: userId
    });

    if (error) {
      throw new Error(`Error fetching user stats: ${error.message}`);
    }

    return data;
  }

  async getUserWeekStats(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data, error } = await this.supabaseAdmin.rpc(
      "get_user_week_stats",
      { user_uuid: userId }
    );

    if (error) {
      throw new Error(`Error fetching week stats: ${error.message}`);
    }

    const { game_count, error_count, total_time_ms } = data;

    return {
      game_count,
      error_count,
      total_time: total_time_ms,
      total_time_unit: "ms"
    };
  }

  async getAverageUserWeekStats() {
    const { data, error } = await this.supabaseAdmin.rpc(
      "get_average_user_week_stats"
    );

    if (error) {
      throw new Error(`Error fetching average stats: ${error.message}`);
    }

    const {
      total_matches_played,
      total_errors_made,
      total_time_played_ms,
      errors_per_game
    } = data;

    return {
      total_matches_played,
      total_errors_made,
      total_time: total_time_played_ms,
      total_time_unit: "ms",
      errors_per_game
    };
  }

  async getUserRankings() {
    const { data, error } = await this.supabase.rpc("get_user_rankings");

    if (error) {
      throw new Error(`Error fetching user rankings: ${error.message}`);
    }

    return data;
  }
}
