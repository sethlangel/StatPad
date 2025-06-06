import { supabase, supabaseAdmin } from "../supabase-client.js";

export class GameService {
  constructor(supabaseClient = supabase, supabaseAdminClient = supabaseAdmin) {
    this.supabase = supabaseClient;
    this.supabaseAdmin = supabaseAdminClient;
  }

  async createGame(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data, error } = await this.supabaseAdmin
      .from("games")
      .insert({ user_id: userId })
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "Game started",
      gameId: data[0].id
    };
  }

  async finishGame(gameId) {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    const { error } = await this.supabaseAdmin
      .from("games")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", gameId);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Game finished successfully" };
  }

  async getCurrentGame(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data, error } = await this.supabaseAdmin
      .from("games")
      .select("id, finished_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { id: -1 };
    }

    const gameId = data[0].finished_at === null ? data[0].id : -1;
    return { id: gameId };
  }

  async validateGameExists(gameId, userId) {
    if (!gameId || !userId) {
      throw new Error("Game ID and User ID are required");
    }

    const { data, error } = await this.supabase
      .from("games")
      .select("id")
      .eq("id", gameId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new Error("Game not found or unauthorized");
    }

    return data;
  }
}
