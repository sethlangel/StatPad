import express from "express";
import { supabase, supabaseAdmin } from "../supabase-client.js";

const router = express.Router();

// ====================
// POST /watch/stats-today?user_id=123
// ====================
router.get("/stats-today", async (req, res) => {
  console.log("req = ", req.query);
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("errors")
    .select("*", { count: "exact", head: true }) // returns count only and not full rows
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00Z`);

  console.log("data = ", data);
  console.log("error = ", error);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ errors: data });
});

// ====================
// POST /watch/new-game
// ====================
router.post("/new-game", async (req, res) => {
  console.log("req = ", req.body);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Validate that the user exists
  const { userData, userError } = await supabaseAdmin
    .from("auth.users")
    .select("id")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    return res.status(404).json({ error: "User not found" });
  }

  const { data, error } = await supabaseAdmin
    .from("games")
    .insert({ user_id: userId })
    .select();

  console.log("data = ", data);
  console.log("error = ", error);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: "Game started",
    gameId: data[0].id
  });
});

// ====================
// POST /watch/log-error
// ====================
const getErrorIdByName = async (errorName) => {
    const { data, error } = await supabase
        .from("error_list")
        .select("id")
        .eq("name", errorName)
        .single();

    if (error || !data) {
        console.error("Error looking up error_id: ", error);
        return null;
    }

    return data.id;
};

router.post("/log-error", async (req, res) => {
  console.log("req = ", req);
  const { gameId, errorType, userId } = req.body;

  // Validate input
  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  if (!errorType) {
    return res.status(400).json({ error: "Missing errorType" });
  }

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Validate if game exists
  const { gameData, gameError } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .eq("user_id", userId)
    .single();
    
  if (gameError || !gameData) {
        return res.status(404).json({ error: "Game not found or unauthorized" });
  }

  // Validate error type 
  const { errorData, errorTypeError } = await supabase
    .from("error_list")
    .select("id")
    .eq("name", errorType)
    .single();
    
  if (errorTypeError || !errorListData) {
      return res
        .status(400)
        .json({ error: "Invalid error type" });
  }

  const errorId = await getErrorIdByName(errorType);
  if (!errorId) {
    return res.status(400).json({ error: "Invalid error type" });
  }

  const { data, error } = await supabase.from("errors").insert({
    game_id: gameId,
    error_id: errorType,
    user_id: userId
  });

  console.log("data = ", data);
  console.log("error = ", error);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: "Error logged",
    data
  });
});

export default router;
