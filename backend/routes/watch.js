import express from "express";
import { supabase, supabaseAdmin } from "../supabase-client.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

// ====================
// POST /watch/stats-today
// ====================
router.get(
  "/stats-today",
  authenticateUser,
  async (req, res) => {
    const today = new Date().toISOString().split("T")[0];

    const response = await supabase
      .from("errors")
      .select("*", { count: "exact", head: true }) // returns count only and not full rows
      .eq("user_id", req.user.id)
      .gte("created_at", `${today}T00:00:00Z`);

    if (response.error) {
      return res
        .status(500)
        .json({ error: response.error.message });
    }

    res.json({ errors: response.count });
  }
);

// Returns the ID of the user's current game (the most recently started game) if it hasn't finished.
// If it has finished, -1 is returned. Can be used to check if the user is currently in a game or not.
// Defined in a new function so it can be used in /watch/end-game as well
async function getCurrentGameId(req) {
  const response = await supabaseAdmin
    .from("games")
    .select("id, finished_at")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (response.error) {
    return { error: response.error };
  }

  let gameId =
    response.data[0].finished_at === null
      ? response.data[0].id
      : -1;

  return { id: gameId };
}

router.get(
  "/games/current",
  authenticateUser,
  async (req, res) => {
    let response = await getCurrentGameId(req);

    if (response.error) {
      return res.status(500).json({ error: response.error });
    }

    return res.status(201).json(response);
  }
);

router.post("/games", authenticateUser, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("games")
    .insert({ user_id: req.user.id })
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: "Game started",
    gameId: data[0].id
  });
});

// mark a game as completed
router.patch(
  "/games/:id",
  authenticateUser,
  async (req, res) => {
    //const response = await getCurrentGameId(req);
    const response = await supabaseAdmin
      .from("games")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", req.params.id);

    if (response.error) {
      return res.status(500).json({ error: response.error });
    }

    res.send(201);
  }
);

// ====================
// POST /watch/log-error
// ====================
router.post(
  "/log-error",
  authenticateUser,
  async (req, res) => {
    const userId = req.user.id;
    const { gameId, errorType } = req.body;

    console.log(userId, gameId, errorType);

    // Validate input
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }

    if (!errorType) {
      return res
        .status(400)
        .json({ error: "Missing errorType" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Validate if game exists
    const gameResponse = await supabase
      .from("games")
      .select("id")
      .eq("id", gameId)
      .eq("user_id", userId)
      .single();

    const gameData = gameResponse.data;
    const gameError = gameResponse.error;

    if (gameError || !gameData) {
      return res
        .status(404)
        .json({ error: "Game not found or unauthorized" });
    }

    // Validate error type
    const errorsResponse = await supabase
      .from("error_list")
      .select("id")
      .eq("name", errorType)
      .single();

    const errorTypeError = errorsResponse.error;
    const errorId = errorsResponse.data.id;

    if (errorTypeError || !errorId) {
      return res
        .status(400)
        .json({ error: "Invalid error type" });
    }

    // TODO: is it bad to use supabaseAdmin?
    const insertResponse = await supabaseAdmin
      .from("errors")
      .insert({
        game_id: gameId,
        error_id: errorId,
        user_id: userId
      });

    if (insertResponse.error) {
      return res
        .status(500)
        .json({ error: insertResponse.error.message });
    }

    res.status(201).json({ message: "Error logged" });
  }
);

export default router;
