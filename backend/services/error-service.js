import { supabase, supabaseAdmin } from "../supabase-client.js";

export class ErrorService {
  constructor(supabaseClient = supabase, supabaseAdminClient = supabaseAdmin) {
    this.supabase = supabaseClient;
    this.supabaseAdmin = supabaseAdminClient;
  }

  async logError(userId, gameId, errorType) {
    if (!userId || !gameId || !errorType) {
      throw new Error("User ID, Game ID, and Error Type are required");
    }

    // Validate error type exists
    const errorTypeData = await this.validateErrorType(errorType);

    const insertResponse = await this.supabaseAdmin
      .from("errors")
      .insert({
        game_id: gameId,
        error_id: errorTypeData.id,
        user_id: userId
      });

    if (insertResponse.error) {
      throw new Error(insertResponse.error.message);
    }

    return { message: "Error logged successfully" };
  }

  async validateErrorType(errorType) {
    if (!errorType) {
      throw new Error("Error type is required");
    }

    const { data, error } = await this.supabase
      .from("error_list")
      .select("id")
      .eq("name", errorType)
      .single();

    if (error || !data) {
      throw new Error("Invalid error type");
    }

    return data;
  }

  async getTodayErrorCount(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const today = new Date().toISOString().split("T")[0];

    const { count, error } = await this.supabase
      .from("errors")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00Z`);

    if (error) {
      throw new Error(error.message);
    }

    return { errors: count || 0 };
  }

  async getUserErrorTrajectory(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data, error } = await this.supabase
      .from("errors")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const trajectoryData = data.reduce((acc, error) => {
      const date = new Date(error.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(trajectoryData).map(([date, count]) => ({
      date,
      count
    }));
  }
}
