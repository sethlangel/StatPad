import express from "express";
import authenticateUser from "../middleware/auth.js";
import { supabaseAdmin } from "../supabase-client.js";

const router = express.Router();

router.get("/weekly", authenticateUser, async (req, res) => {
  const { data, error } = await supabaseAdmin.rpc(
    "get_user_week_stats",
    { user_uuid: req.user.id }
  );

  if (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send({ error });
    return;
  }

  const { game_count, error_count, total_time_ms } = data;

  res.status(201).send({
    game_count,
    error_count,
    total_time: total_time_ms,
    total_time_unit: "ms"
  });
});

router.get("/social", authenticateUser, async (req, res) => {
  console.log("social called");
  const { data, error } = await supabaseAdmin.rpc(
    "get_average_user_week_stats"
  );

  if (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send({ error });
    return;
  }

  const {
    total_matches_played,
    total_errors_made,
    total_time_played_ms,
    errors_per_game
  } = data;

  res.status(201).send({
    total_matches_played,
    total_errors_made,
    total_time: total_time_played_ms,
    total_time_unit: "ms",
    errors_per_game
  });
});

export default router;
