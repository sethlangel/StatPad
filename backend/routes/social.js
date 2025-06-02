import express from "express";
import { supabase, supabaseAdmin } from "../supabase-client.js";

const router = express.Router();

// GET /ranking - Fetches user ranking data via RPC
router.get("/ranking", async (req, res) => {
  try {
    const { data: rankingData, error } = await supabase.rpc(
      "get_user_rankings"
    );

    if (error) throw error;

    // Data is already sorted by the SQL function
    res.status(200).json(rankingData);
  } catch (error) {
    console.error(
      "Error fetching user rankings:",
      error.message
    );
    res.status(500).json({
      error: "Failed to fetch user rankings",
      details: error.message
    });
  }
});

// GET /trajectory/:userId - Fetches trajectory data for a user
router.get("/trajectory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch errors for the user, ordered by creation date
    const { data: errors, error: errorsError } = await supabase
      .from("errors")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (errorsError) throw errorsError;

    const trajectoryData = errors.reduce((acc, error) => {
      const date = new Date(
        error.created_at
      ).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const formattedTrajectoryData = Object.entries(
      trajectoryData
    ).map(([date, count]) => ({
      date,
      count
    }));

    res.status(200).json(formattedTrajectoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
